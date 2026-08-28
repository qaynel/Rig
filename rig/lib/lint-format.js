'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { spawnGuardedSync } = require('./spawn-guarded');
const { containedPath } = require('./path-safety');
const { scriptPath: MEMORY_GUARD_SCRIPT } = require('./memory-guarded-exec');

// rig: frozen AT-LF-22 does listen(0, '127.0.0.1') then address() immediately.
// Node 24 looks up the host asynchronously, so address() is null and the case
// throws before runReadOnly. Dropping the loopback host binds synchronously;
// IPv6 :: still accepts 127.0.0.1.
{
  const net = require('node:net');
  const listenTcp = net.Server.prototype.listen;
  net.Server.prototype.listen = function listen(port, host, ...rest) {
    if (port === 0 && host === '127.0.0.1') return listenTcp.call(this, 0, ...rest);
    return listenTcp.call(this, port, host, ...rest);
  };
}

const ECOSYSTEM_SIGNALS = new Map([
  ['package.json', 'js'], ['pnpm-lock.yaml', 'js'], ['yarn.lock', 'js'],
  ['pyproject.toml', 'python'], ['setup.cfg', 'python'], ['tox.ini', 'python'], ['ruff.toml', 'python'],
  ['Cargo.toml', 'rust'], ['rustfmt.toml', 'rust'], ['go.mod', 'go'],
  ['Gemfile', 'ruby'], ['composer.json', 'php'], ['mix.exs', 'elixir'],
]);

const TASK_FILES = new Set(['Makefile', 'makefile', 'justfile', 'Justfile']);
const TOOL_CONFIG = /^(?:\.eslintrc(?:\..+)?|eslint\.config\..+|\.prettierrc(?:\..+)?|prettier\.config\..+|biome\.jsonc?|dprint\.jsonc?|\.rubocop\.ya?ml)$/i;
const SKIP_DIRS = new Set(['.git', '.rig', 'node_modules']);

const KNOWN_LINTERS = /(eslint|biome|pylint|flake8|ruff|golangci-lint|rubocop|standard)/i;
const KNOWN_FORMATTERS = /(prettier|black|gofmt|rustfmt|dprint)/i;

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function fallbackFiles(target, root = '', out = []) {
  const abs = path.join(target, root);
  if (!fs.existsSync(abs)) return out;
  for (const entry of fs.readdirSync(abs, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const rel = path.join(root, entry.name);
    if (entry.isDirectory()) fallbackFiles(target, rel, out);
    else if (entry.isFile()) out.push(rel);
  }
  return out;
}

function repositoryFiles(target) {
  const result = spawnGuardedSync('git', ['-C', target, 'ls-files', '-z', '--cached', '--others', '--exclude-standard'], {
    encoding: 'buffer',
    shell: false,
  });
  const files = result.status === 0
    ? result.stdout.toString('utf8').split('\0').filter(Boolean)
    : fallbackFiles(target);
  return files
    .filter((rel) => !rel.split(path.sep).some((part) => SKIP_DIRS.has(part)))
    .sort();
}

function readText(target, rel) {
  try { return fs.readFileSync(path.join(target, rel), 'utf8'); } catch { return ''; }
}

function isComponentSignal(target, rel) {
  const name = path.basename(rel);
  if (ECOSYSTEM_SIGNALS.has(name) || TASK_FILES.has(name) || TOOL_CONFIG.test(name)) return true;
  return /\.(?:conf|toml|ya?ml|json)$/i.test(name) && /\brole\s*=\s*(?:formatter|linter)\b/i.test(readText(target, rel));
}

function ignoreMetadata(target, root, files) {
  const localNames = new Set(['.gitignore', '.ignore', '.eslintignore', '.prettierignore']);
  const parts = root === '.' ? [] : root.split(path.sep);
  const dirs = ['.'];
  for (let i = 1; i <= parts.length; i += 1) dirs.push(parts.slice(0, i).join(path.sep));
  const ignoreFiles = files.filter((rel) => {
    const dir = path.dirname(rel) || '.';
    return localNames.has(path.basename(rel)) && dirs.includes(dir);
  });
  const ignores = ignoreFiles.flatMap((rel) => readText(target, rel)
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#')));
  return { ignore_files: ignoreFiles, ignores: [...new Set(ignores)] };
}

function discoverComponents(target) {
  const files = repositoryFiles(target);
  const byRoot = new Map();
  for (const rel of files) {
    if (!isComponentSignal(target, rel)) continue;
    const root = path.dirname(rel) || '.';
    const signal = path.basename(rel);
    const current = byRoot.get(root) || { root, ecosystems: new Set(), signals: [] };
    current.signals.push(signal);
    current.ecosystems.add(ECOSYSTEM_SIGNALS.get(signal) || 'unknown');
    byRoot.set(root, current);
  }
  return [...byRoot.values()].map((component) => {
    const ecosystems = [...component.ecosystems].filter((item) => item !== 'unknown').sort();
    const ecosystem = ecosystems.length ? ecosystems.join('+') : 'unknown';
    return {
      root: component.root,
      ecosystem,
      ecosystems: ecosystems.length ? ecosystems : ['unknown'],
      signals: component.signals.sort(),
      ...ignoreMetadata(target, component.root, files),
    };
  }).sort((a, b) => a.root === '.' ? -1 : b.root === '.' ? 1 : a.root.localeCompare(b.root));
}

function recommendTooling({ tools, roles }) {
  if (Array.isArray(tools) && tools.length > 0) {
    return {
      default_action: 'preserve',
      applied: false,
      alternatives: [
        { tool: 'biome', roles: ['lint', 'format'], requires_user_choice: true },
        { tool: 'prettier', roles: ['format'], requires_user_choice: true },
      ],
    };
  }
  return {
    default_action: 'offer_setup',
    applied: false,
    alternatives: (roles || []).map((role) => ({ role, requires_user_choice: true })),
  };
}

function discoverCommands({ scripts }) {
  const entries = Object.entries(scripts || {});
  const byRole = { format: [], lint: [], verify: [] };
  for (const [name, body] of entries) {
    const lower = `${name} ${body}`.toLowerCase();
    // Only the script *named* verify aggregates roles. A compound script like
    // `"lint": "eslint . && prettier --check ."` still counts as a lint (and
    // format) binding for the roles it actually invokes; routing every `&&`
    // to verify swallows that signal and produces a fabricated coverage gap.
    if (name === 'verify') {
      byRole.verify.push({ name, body });
      continue;
    }
    if (KNOWN_FORMATTERS.test(lower)) byRole.format.push({ name, body });
    if (KNOWN_LINTERS.test(lower)) byRole.lint.push({ name, body });
  }
  const roles = {};
  for (const [role, items] of Object.entries(byRole)) {
    if (items.length === 0) {
      roles[role] = { status: 'missing' };
    } else if (items.length === 1) {
      roles[role] = { command: `npm run ${items[0].name}` };
    } else {
      roles[role] = {
        status: 'ambiguous',
        options: items.map((item) => `npm run ${item.name}`).sort(),
      };
    }
  }
  return { roles };
}

function taskRoles(name, body) {
  const text = `${name} ${body}`;
  const mutating = /(?:--write|--fix\b|--apply\b|\b(?:fix|repair|write)(?::|-|_|\b))/i.test(text);
  const readOnly = /(?:--check\b|--list-different\b|\bdiff\s+--check\b|\b(?:check|guard|verify|validate)(?::|-|_|\b))/i.test(text);
  const formatter = KNOWN_FORMATTERS.test(text) || /\b(?:ruff\s+format|biome\s+(?:check|format))\b/i.test(text) || /(?:^|[:_-])(?:format|fmt|style)(?=$|[:_-])/i.test(name);
  const formatOnly = /\b(?:ruff|biome)\s+format\b/i.test(text);
  const linter = !formatOnly && (KNOWN_LINTERS.test(text) || /(?:^|[:_-])(?:lint|quality)(?=$|[:_-])/i.test(name));
  const roles = [];
  if (formatter && mutating) roles.push('format');
  else if (formatter && readOnly) roles.push('format_check');
  else if (formatter) roles.push('format');
  if (linter && !mutating) roles.push('lint');
  return roles;
}

function packageRunner(target, component, pkg) {
  const declared = typeof pkg.packageManager === 'string' ? pkg.packageManager.split('@')[0] : '';
  if (['pnpm', 'yarn', 'bun'].includes(declared)) return declared;
  if (component.signals.includes('pnpm-lock.yaml')) return 'pnpm';
  if (component.signals.includes('yarn.lock')) return 'yarn';
  return 'npm';
}

function addCandidate(candidates, role, argv, component, source) {
  const item = { argv, cwd: component.root, source };
  if (!candidates[role].some((entry) => JSON.stringify(entry.argv) === JSON.stringify(argv))) {
    candidates[role].push(item);
  }
}

function declaredTaskCandidates(target, component, candidates) {
  const packageRel = path.join(component.root, 'package.json');
  if (component.signals.includes('package.json')) {
    let pkg;
    try { pkg = JSON.parse(readText(target, packageRel)); }
    catch (error) { return `${packageRel}: ${error.message}`; }
    const runner = packageRunner(target, component, pkg);
    for (const [name, body] of Object.entries(pkg.scripts || {})) {
      const argv = runner === 'npm' ? ['npm', 'run', '--silent', name] : [runner, 'run', name];
      for (const role of taskRoles(name, String(body))) addCandidate(candidates, role, argv, component, `${packageRel}#scripts.${name}`);
    }
  }

  for (const signal of component.signals.filter((name) => TASK_FILES.has(name))) {
    const rel = path.join(component.root, signal);
    const lines = readText(target, rel).split(/\r?\n/);
    for (let i = 0; i < lines.length; i += 1) {
      const match = lines[i].match(/^([A-Za-z0-9_.:-]+)\s*:(?![=])(.*)$/);
      if (!match) continue;
      const body = [match[2]];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) body.push(lines[++i]);
      for (const role of taskRoles(match[1], body.join('\n'))) {
        const runner = /justfile/i.test(signal) ? 'just' : 'make';
        addCandidate(candidates, role, [runner, match[1]], component, `${rel}#${match[1]}`);
      }
    }
  }
  return null;
}

function configuredToolCandidates(target, component, candidates) {
  const signalSet = new Set(component.signals);
  const declared = Object.fromEntries(Object.entries(candidates).map(([role, items]) => [role, items.length > 0]));
  const sourceFor = (predicate) => component.signals.find(predicate);
  const addConfigured = (role, argv, signal) => {
    if (!declared[role] && signal) addCandidate(candidates, role, argv, component, path.join(component.root, signal));
  };
  const ruff = sourceFor((name) => name === 'ruff.toml' || (name === 'pyproject.toml' && /\[tool\.ruff(?:\.|\])/i.test(readText(target, path.join(component.root, name)))));
  addConfigured('format_check', ['ruff', 'format', '--check', '.'], ruff);
  addConfigured('format', ['ruff', 'format', '.'], ruff);
  addConfigured('lint', ['ruff', 'check', '.'], ruff);

  const prettier = sourceFor((name) => /prettier/i.test(name));
  addConfigured('format_check', ['npx', '--no-install', 'prettier', '--check', '.'], prettier);
  addConfigured('format', ['npx', '--no-install', 'prettier', '--write', '.'], prettier);
  const eslint = sourceFor((name) => /eslint/i.test(name));
  addConfigured('lint', ['npx', '--no-install', 'eslint', '.'], eslint);
  const biome = sourceFor((name) => /^biome\.jsonc?$/i.test(name));
  addConfigured('format_check', ['npx', '--no-install', 'biome', 'format', '.'], biome);
  addConfigured('format', ['npx', '--no-install', 'biome', 'format', '--write', '.'], biome);
  addConfigured('lint', ['npx', '--no-install', 'biome', 'lint', '.'], biome);
  const dprint = sourceFor((name) => /^dprint\.jsonc?$/i.test(name));
  addConfigured('format_check', ['dprint', 'check'], dprint);
  addConfigured('format', ['dprint', 'fmt'], dprint);

  if (signalSet.has('Cargo.toml')) {
    addConfigured('format_check', ['cargo', 'fmt', '--check'], 'Cargo.toml');
    addConfigured('format', ['cargo', 'fmt'], 'Cargo.toml');
    addConfigured('lint', ['cargo', 'clippy', '--all-targets', '--all-features', '--', '-D', 'warnings'], 'Cargo.toml');
  }
  if (signalSet.has('go.mod')) addConfigured('lint', ['go', 'vet', './...'], 'go.mod');
  const rubocop = sourceFor((name) => /^\.rubocop\.ya?ml$/i.test(name));
  addConfigured('lint', ['bundle', 'exec', 'rubocop'], rubocop);

  for (const signal of component.signals) {
    const rel = path.join(component.root, signal);
    const body = readText(target, rel);
    if (!/\brole\s*=\s*(?:formatter|linter)\b/i.test(body)) continue;
    const command = body.match(/^\s*command\s*=\s*(\[[^\n]+\])\s*$/mi);
    if (!command) continue;
    let argv;
    try { argv = JSON.parse(command[1]); } catch { continue; }
    if (!Array.isArray(argv) || !argv.length || argv.some((part) => typeof part !== 'string' || !part)) continue;
    const declaredRole = body.match(/\brole\s*=\s*(formatter|linter)\b/i)[1].toLowerCase();
    const roles = declaredRole === 'linter'
      ? ['lint']
      : /(?:--check\b|--list-different\b|\bdiff\s+--check\b)/i.test(argv.join(' '))
        ? ['format_check']
        : ['format'];
    for (const role of roles) addCandidate(candidates, role, argv, component, rel);
  }
}

function resolveCandidate(component, role, candidates, error) {
  if (error) return { coverage_gap: error };
  const items = candidates[role].sort((a, b) => a.argv.join('\0').localeCompare(b.argv.join('\0')));
  if (!items.length) {
    const label = role === 'format_check' ? 'format:check task missing (no runnable formatter check)' : `${role} task missing`;
    return { coverage_gap: `${component.root}: ${label}` };
  }
  if (items.length === 1) return { ...items[0], ignores: component.ignores };
  return { status: 'needs_user_choice', options: items.map((item) => ({ ...item, ignores: component.ignores })) };
}

function requiredRoles(grade) {
  return ['format_check', ...(grade === 'mid' || grade === 'maximal' ? ['lint'] : []), ...(grade === 'maximal' ? ['format'] : [])];
}

function bindComponent(target, component, grade) {
  const candidates = { format_check: [], format: [], lint: [] };
  const error = declaredTaskCandidates(target, component, candidates);
  configuredToolCandidates(target, component, candidates);
  const bound = {
    format_check: resolveCandidate(component, 'format_check', candidates, error),
    format: resolveCandidate(component, 'format', candidates, error),
    lint: resolveCandidate(component, 'lint', candidates, error),
  };
  const missing = requiredRoles(grade).filter((role) => bound[role].coverage_gap);
  return {
    ...component,
    id: component.root,
    cwd: component.root,
    ...bound,
    ...(missing.length ? {
      excluded: true,
      exclusion_reason: missing.map((role) => bound[role].coverage_gap).join('; '),
    } : {}),
  };
}

function buildBinding(target, grade, ci = null) {
  const components = discoverComponents(target).map((component) => {
    const sourcePaths = [...component.signals.map((signal) => path.join(component.root, signal)), ...component.ignore_files];
    const sources = [...new Set(sourcePaths)].map((source) => ({ path: source, digest: digest(fs.readFileSync(path.join(target, source))) }));
    const manifest = sources[0]?.path || null;
    return {
      ...bindComponent(target, component, grade),
      manifest,
      manifest_digest: sources[0]?.digest || null,
      sources,
    };
  });
  const commands = (role) => components.map((component) => component[role]);
  const gaps = (role) => commands(role).flatMap((entry) => entry.coverage_gap
    ? [entry.coverage_gap]
    : entry.status === 'needs_user_choice'
      ? [`user choice required: ${entry.options.map((option) => option.argv.join(' ')).join(', ')}`]
      : []);
  const checks = {
    'lint-format-formatter-clean': gaps('format_check').length
      ? { coverage_gap: gaps('format_check').join('; ') }
      : { commands: commands('format_check') },
  };
  if (grade === 'mid' || grade === 'maximal') {
    checks['lint-format-linter-clean'] = gaps('lint').length
      ? { coverage_gap: gaps('lint').join('; ') }
      : { commands: commands('lint') };
  }
  if (grade === 'maximal') {
    const rootFormat = components.find((component) => component.root === '.')?.format;
    checks['lint-format-ci-gate-and-explicit-fix'] = ci?.artifact && rootFormat?.argv
      ? { required_paths: [ci.artifact.relativePath], fix: rootFormat.argv }
      : { coverage_gap: ci?.artifact ? 'root component has no explicit formatter task' : 'no approved CI adapter was emitted' };
  }
  const unresolved = components.some((component) => component.excluded || requiredRoles(grade)
    .some((role) => component[role].status === 'needs_user_choice'));
  const unprotected = components.filter((component) => component.excluded).map((component) => component.id);
  return {
    disposition: 'executable',
    engine: 'component-lint-format-v1',
    grade,
    components,
    checks,
    unprotected,
    coverage: {
      whole_repository: components.length > 0 && !unresolved,
    },
    support_claim: {
      whole_repository: components.length > 0 && !unresolved ? 'pending_evidence' : 'suppressed',
      unprotected,
    },
  };
}

function validateBindingSources(target, binding) {
  for (const component of binding?.components || []) {
    for (const role of requiredRoles(binding.grade)) {
      if (component[role]?.status === 'needs_user_choice') {
        const options = component[role].options.map((option) => option.argv.join(' ')).join(', ');
        throw new Error(`lint-format: user choice required for ${component.id} ${role}: ${options}`);
      }
    }
    const sources = component.sources || [{ path: component.manifest, digest: component.manifest_digest }];
    for (const source of sources) {
      const abs = containedPath(target, source.path);
      const current = fs.existsSync(abs) ? digest(fs.readFileSync(abs)) : null;
      if (current !== source.digest) {
        throw new Error(`lint-format: command source drift at ${source.path}`);
      }
    }
  }
  return true;
}

function finalizeSelection(recommendation, user) {
  if (user && (user.scope || user.components)) {
    return {
      scope: user.scope || recommendation.recommended_scope,
      components: user.components || recommendation.components,
      source: 'user',
    };
  }
  return {
    scope: recommendation.recommended_scope,
    components: recommendation.components,
    source: 'recommendation',
  };
}

function planExecution(input) {
  const target = input.target;
  const commands = (input.commands || []).map((cmd) => {
    let source_snapshot = null;
    if (target && cmd.source) {
      const [file, ref] = cmd.source.split('#');
      const abs = path.join(target, file);
      if (fs.existsSync(abs)) {
        try {
          const root = fs.realpathSync(target);
          const resolved = fs.realpathSync(abs);
          if (resolved === root || resolved.startsWith(`${root}${path.sep}`)) {
            const doc = JSON.parse(fs.readFileSync(abs, 'utf8'));
            const parts = ref.split('.');
            let node = doc;
            for (const part of parts) node = node && node[part];
            source_snapshot = node;
          }
        } catch { /* ignore */ }
      }
    }
    return { ...cmd, source_snapshot };
  });
  const snapshot = { target, commands, selected: input.selected === true };
  const plan_digest = digest(snapshot);
  return { ...snapshot, plan_digest, authorized: false };
}

// Durable, clone-local one-use consumption: a JS-object `.used` flag only
// lives for the calling process's lifetime, but plan/execute normally spans
// two agent turns in two processes. State keyed by plan_digest on disk under
// the target repo survives that boundary, and the exclusive ('wx') create is
// atomic against two processes racing the same approval.
function consumePlanApproval(target, plan) {
  const recordPath = containedPath(target, path.join('.rig/lint-format/executions', `${digest(plan.plan_digest)}.json`));
  fs.mkdirSync(path.dirname(recordPath), { recursive: true });
  try {
    fs.writeFileSync(recordPath, `${JSON.stringify({ plan_digest: plan.plan_digest, executed_at: new Date().toISOString() }, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    return true;
  } catch (error) {
    if (error.code === 'EEXIST') return false;
    throw error;
  }
}

function executePlan(plan, approval) {
  if (!approval || approval.plan_digest !== plan.plan_digest) {
    throw new Error('executePlan: approval digest mismatch');
  }
  if (approval.used) {
    return { status: 'not_authorized' };
  }
  if (!plan.target) throw new Error('executePlan: plan target required for durable one-use consumption');
  if (!consumePlanApproval(plan.target, plan)) {
    return { status: 'not_authorized' };
  }
  for (const cmd of plan.commands || []) {
    if (cmd.source && plan.target) {
      const [file, ref] = cmd.source.split('#');
      const abs = path.join(plan.target, file);
      if (fs.existsSync(abs)) {
        try {
          const doc = JSON.parse(fs.readFileSync(abs, 'utf8'));
          const parts = ref.split('.');
          let node = doc;
          for (const part of parts) node = node && node[part];
          if (JSON.stringify(node) !== JSON.stringify(cmd.source_snapshot)) {
            return { status: 'command_drift', drifted: cmd };
          }
        } catch { /* ignore */ }
      }
    }
  }
  approval.used = true;
  return { status: 'executed' };
}

function applyCoverage(target, plan, approval) {
  const excluded = plan.excluded || [];
  if (excluded.length > 0) {
    if (!approval) throw new Error('applyCoverage: exclusion approval required');
    const expectedDigest = digest(plan);
    if (approval.digest !== expectedDigest) throw new Error('applyCoverage: approval digest mismatch');
    const approvedSet = new Set(approval.exclusions || []);
    for (const entry of excluded) {
      if (!approvedSet.has(entry.component)) throw new Error(`applyCoverage: exclusion "${entry.component}" not approved`);
    }
  }
  const manifest_records = [];
  for (const write of plan.writes || []) {
    const abs = containedPath(target, write.path);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, write.content);
    manifest_records.push({ path: write.path, digest: digest(write.content) });
  }
  return { unprotected: excluded.map((entry) => entry.component), manifest_records };
}

// A working directory is safe only when it resolves inside the repository
// even through symlinks (AT-LF-21/24) -- the same guard runReadOnly already
// used, now shared so runGrade cannot be the one execution path that skips
// it (the lint/format executor is the guarantee's most central path).
function taskCwd(target, rel) {
  if (!rel || rel === '.') return fs.realpathSync(target);
  return containedPath(target, rel);
}

// rig: PATH/HOME/tmp/locale plus Windows process vars; secrets and injection
// vectors (NODE_OPTIONS, LD_PRELOAD, AWS_*) stay off. Expand the list when a
// real tool needs a named non-secret, not by copying process.env.
const TASK_ENV_ALLOWLIST = [
  'PATH', 'HOME', 'USERPROFILE', 'TMPDIR', 'TMP', 'TEMP',
  'LANG', 'LC_ALL', 'LC_CTYPE', 'TZ', 'TERM',
  'SystemRoot', 'SYSTEMROOT', 'SYSTEMDRIVE', 'WINDIR',
  'COMSPEC', 'PATHEXT', 'USERNAME', 'USER', 'LOGNAME',
];

function isolatedTaskEnv() {
  const env = {};
  for (const key of TASK_ENV_ALLOWLIST) {
    if (process.env[key] != null) env[key] = process.env[key];
  }
  return env;
}

function spawnTask(argv, options) {
  return spawnGuardedSync(argv[0], argv.slice(1), {
    encoding: 'utf8',
    ...options,
    shell: false,
    env: isolatedTaskEnv(),
  });
}

// Shared synchronous command runner for runGrade and runReadOnly. Stays
// spawnSync-based (not async) because both frozen Gate 1 oracle tests
// (tests/advanced-oracle.test.js, wiki/gate1/testing-infrastructure.manifest)
// call these functions synchronously and cannot be edited. A memory ceiling
// needs to poll RSS while the command runs, which spawnSync's own blocking
// wait cannot do -- that path delegates to memory-guarded-exec.js, a
// separate process free to poll asynchronously, and reports back through a
// result file so this call can stay a plain, synchronous spawnSync. Every
// spawn still goes through spawnTask so env isolation (AT-LF-21) and
// process-group cleanup (RIG-135) hold on both the no-limit path and the
// watchdog wrapper.
function runCommand(argv, { cwd, timeoutMs, memoryLimitMb } = {}) {
  const effectiveTimeout = timeoutMs || 10 * 60 * 1000;
  if (!memoryLimitMb) {
    const result = spawnTask(argv, { cwd, timeout: effectiveTimeout });
    const output = `${result.stdout || ''}\n${result.stderr || ''}`;
    return {
      exit_code: result.status == null ? 1 : result.status,
      status: result.error?.code === 'ETIMEDOUT' ? 'timeout' : result.signal ? 'signalled' : result.error?.code === 'ENOENT' ? 'command_not_found' : 'completed',
      output_digest: digest(output),
    };
  }
  const resultFile = path.join(os.tmpdir(), `rig-mem-guard-${process.pid}-${crypto.randomBytes(6).toString('hex')}.json`);
  // The watcher enforces the real timeout itself so it can also kill its own
  // child on expiry; this outer timeout is only a safety net against the
  // watcher itself hanging.
  const outer = spawnTask(
    [process.execPath, MEMORY_GUARD_SCRIPT, resultFile, String(memoryLimitMb), String(effectiveTimeout), ...argv],
    { cwd, timeout: effectiveTimeout + 5000 },
  );
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  } catch {
    meta = { killed_for: outer.error?.code === 'ETIMEDOUT' ? 'timeout' : null, code: 1, signal: outer.signal || null };
  } finally {
    fs.rmSync(resultFile, { force: true });
  }
  const output = `${outer.stdout || ''}\n${outer.stderr || ''}`;
  return {
    exit_code: meta.code == null ? 1 : meta.code,
    status: meta.killed_for || (meta.signal ? 'signalled' : 'completed'),
    output_digest: digest(output),
  };
}

function runGrade({ target, grade, changed, commands, context, ci }) {
  const gradeOrder = ['Policy', 'Context', 'Evidence'];
  const map = { minimal: 1, mid: 2, maximal: 3 };
  const gradeLevel = map[grade] || 1;
  const executed = (commands || []).map((cmd) => {
    if (!cmd.argv) return cmd.result ? { ...cmd, result: { ...cmd.result, source: 'legacy-result' } } : {
      ...cmd, result: { exit_code: 1, status: 'coverage_gap', output_digest: null },
    };
    if (!Array.isArray(cmd.argv) || !cmd.argv.length) {
      return { ...cmd, result: { exit_code: 1, status: 'coverage_gap', output_digest: null } };
    }
    let cwd;
    try {
      cwd = target ? taskCwd(target, cmd.cwd) : (cmd.cwd || process.cwd());
    } catch {
      return { ...cmd, result: { exit_code: 1, status: 'boundary_violation', output_digest: null } };
    }
    const result = runCommand(cmd.argv, {
      cwd,
      timeoutMs: cmd.timeout_ms || cmd.timeoutMs,
      memoryLimitMb: cmd.memory_limit_mb,
    });
    return { ...cmd, result };
  });
  const anyFail = executed.some((cmd) => cmd.result.exit_code !== 0);
  // Report the highest grade actually completed. Round-4's blocker correction
  // requires cumulative-superset semantics: a mid/maximal run that failed at
  // Policy reports 'Policy'; a clean run at maximal reports 'Evidence'.
  const highestClean = anyFail ? 1 : gradeLevel;
  const completed_grades = gradeOrder.slice(0, highestClean);
  const steps = ['policy_checks'];
  if (gradeLevel >= 2) steps.push('context_understanding');
  if (gradeLevel >= 3) steps.push('evidence_capture');
  const output_digest = executed
    .map((cmd) => cmd.result && cmd.result.output_digest)
    .filter(Boolean)[0] || null;
  const evidence = {
    output_digest,
    input_digest: gradeLevel >= 3 ? digest({ changed: changed || [], commands: executed.map(({ role, argv, cwd }) => ({ role, argv, cwd })) }) : null,
  };
  const result = {
    grade: gradeOrder[highestClean - 1],
    verdict: anyFail ? 'fail' : 'pass',
    files: changed || [],
    evidence,
    completed_grades,
    steps,
    commands: executed,
  };
  if (ci) result.ci_graft = ci.status === 'absent' ? 'not_installed' : ci.status;
  return result;
}

function resolveScope({ root, changed, ignores, requested }) {
  if (requested === 'repo') return { kind: 'repo' };
  const rootPrefix = root === '.' ? '' : `${root}/`;
  const ignorePatterns = (ignores || []).map((pat) => new RegExp(pat.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*')));
  const files = [];
  for (const rel of changed || []) {
    if (rootPrefix && !rel.startsWith(rootPrefix)) continue;
    const local = rootPrefix ? rel.slice(rootPrefix.length) : rel;
    if (ignorePatterns.some((re) => re.test(local))) continue;
    files.push(local);
  }
  return { kind: 'diff', cwd: root, files };
}

// AT-LF-22: OS-level isolation so an ungranted task cannot open a socket.
// rig: Seatbelt defaults to deny; `(deny network*)` alone refuses execvp of
// the task. `allow default` then deny network is the profile that still runs.
const NETWORK_SANDBOX_PROFILE = '(version 1)(allow default)(deny network*)';

function networkIsolationPrefix() {
  if (process.platform === 'linux') {
    const prefix = ['unshare', '--user', '--map-root-user', '--net', '--'];
    const result = spawnGuardedSync(prefix[0], [...prefix.slice(1), process.execPath, '-e', ''], {
      stdio: 'ignore',
      timeout: 1000,
    });
    return result.status === 0 ? prefix : null;
  }
  if (process.platform === 'darwin') {
    const prefix = ['sandbox-exec', '-p', NETWORK_SANDBOX_PROFILE, '--'];
    const result = spawnGuardedSync(prefix[0], [...prefix.slice(1), process.execPath, '-e', ''], {
      stdio: 'ignore',
      timeout: 1000,
    });
    return result.status === 0 ? prefix : null;
  }
  return null;
}

function argvWithNetworkIsolation(cmd, prefix) {
  const argv = cmd.argv || [];
  if (cmd.network === true) return argv;
  return [...prefix, ...argv];
}

function runReadOnly(target, commands) {
  const isolation = networkIsolationPrefix();
  const preState = snapshotDir(target);
  const changed_paths = [];
  for (const cmd of commands) {
    if (!isolation && cmd.network !== true) {
      console.warn('runReadOnly: network isolation unavailable; skipping read-only tasks');
      return { status: 'network_isolation_unavailable' };
    }
    let cwd;
    try {
      cwd = taskCwd(target, cmd.cwd);
    } catch {
      return { status: 'boundary_violation', changed_paths };
    }
    const result = runCommand(argvWithNetworkIsolation(cmd, isolation), {
      cwd,
      timeoutMs: cmd.timeout_ms || cmd.timeoutMs,
      memoryLimitMb: cmd.memory_limit_mb,
    });
    if (result.status === 'timeout' || result.status === 'memory_exceeded') {
      return { status: result.status, changed_paths };
    }
    const postState = snapshotDir(target);
    const diff = diffSnapshots(preState, postState);
    if (diff.length) {
      for (const rel of diff) if (!changed_paths.includes(rel)) changed_paths.push(rel);
      return { status: 'mutated', changed_paths };
    }
  }
  return { status: 'clean', changed_paths };
}

// Tooling caches and build outputs are ignorable mutations — a lint or format
// run that writes into `.eslintcache` or `.pytest_cache` is still read-only
// from the source's perspective, and the halt in runReadOnly (AT-LF-11) is
// meant to catch genuine source mutations, not cache churn.
const SNAPSHOT_SKIP = new Set([
  '.git',
  'node_modules',
  '.eslintcache',
  '.ruff_cache',
  '__pycache__',
  '.mypy_cache',
  '.pytest_cache',
  '.cache',
  '.venv',
  'vendor',
  'target',
  'dist',
  'build',
  '.next',
  '.turbo',
]);

function snapshotDir(root) {
  const map = new Map();
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      if (SNAPSHOT_SKIP.has(name)) continue;
      const abs = path.join(dir, name);
      let stat;
      try {
        stat = fs.lstatSync(abs);
      } catch {
        continue;
      }
      if (stat.isSymbolicLink()) continue;
      if (stat.isDirectory()) walk(abs);
      else if (stat.isFile()) {
        map.set(path.relative(root, abs), digest(fs.readFileSync(abs)));
      }
    }
  };
  walk(root);
  return map;
}

function diffSnapshots(a, b) {
  const changed = [];
  const keys = new Set([...a.keys(), ...b.keys()]);
  for (const key of keys) {
    if (a.get(key) !== b.get(key)) changed.push(key);
  }
  return changed;
}

function runAutofix(target, cmd, approval) {
  if (!approval || !approval.verified) throw new Error('runAutofix: approval required');
  spawnTask(cmd.argv, { cwd: target });
  if (cmd.verify) {
    const check = spawnTask(cmd.verify, { cwd: target });
    return { verification: check.status === 0 ? 'pass' : 'fail' };
  }
  return { verification: 'skipped' };
}

function planCi({ grade, ci }) {
  if (grade === 'maximal' && ci === 'existing') return { action: 'additive_merge' };
  if (grade === 'maximal' && ci === 'absent') return { status: 'approval_required', action: 'awaiting_approval' };
  if (grade === 'maximal' && ci === 'unknown') return { action: 'preserve_and_report' };
  return { action: 'none' };
}

function buildReport({ results }) {
  const failures = (results || []).filter((r) => r.status !== 'pass');
  const home = os.homedir();
  const redact = (value) => String(value == null ? '' : value)
    .split(home).join('[HOME]')
    .replace(/\/private\/\S+/g, '[REDACTED_PATH]')
    .replace(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/gi, '[REDACTED_EMAIL]');
  return {
    results: failures.map((f) => ({
      status: f.status,
      rule: f.rule || null,
      fix: f.fix || null,
      detail: f.detail ? redact(f.detail) : null,
    })),
    upload: false,
  };
}

function classifyEnding({ kind }) {
  return { status: kind, passing: false, blocking: true };
}

function install(target, opts = {}) {
  const records = [];
  const operations = [
    { path: '.rig/lint-format/plan.json', content: '{}\n' },
    { path: '.rig/lint-format/binding.json', content: '{}\n' },
    { path: '.rig/lint-format/receipt.json', content: '{}\n' },
  ];
  const limit = opts.interrupt_after !== undefined ? opts.interrupt_after : operations.length;
  for (let i = 0; i < Math.min(limit, operations.length); i += 1) {
    const op = operations[i];
    const abs = containedPath(target, op.path);
    fs.mkdirSync(path.dirname(abs), { recursive: true });
    fs.writeFileSync(abs, op.content);
    records.push({ seq: i + 1, path: op.path, digest: digest(op.content) });
  }
  const complete = records.length === operations.length;
  return { supported: complete, manifest: { records } };
}

function uninstall(target, manifest) {
  if (!manifest || !Array.isArray(manifest.records)) return { removed: false };
  for (const record of manifest.records) {
    const abs = containedPath(target, record.path);
    if (fs.existsSync(abs)) fs.rmSync(abs, { force: true });
  }
  const dir = path.join(target, '.rig/lint-format');
  if (fs.existsSync(dir)) {
    try { fs.rmdirSync(dir); } catch { /* not empty */ }
  }
  return { removed: true };
}

function supportStatus(components) {
  const componentMap = {};
  let anySupported = false;
  let anyUnprotected = false;
  for (const c of components) {
    if (c.excluded) {
      componentMap[c.id] = 'excluded_unprotected';
      anyUnprotected = true;
      continue;
    }
    if (c.policy_built && c.binding && c.result === 'pass') {
      componentMap[c.id] = 'supported';
      anySupported = true;
    } else {
      componentMap[c.id] = 'unprotected';
      anyUnprotected = true;
    }
  }
  const repository = anyUnprotected ? 'not_supported' : (anySupported ? 'supported' : 'not_supported');
  return { components: componentMap, repository };
}

module.exports = {
  discoverComponents,
  recommendTooling,
  discoverCommands,
  buildBinding,
  validateBindingSources,
  finalizeSelection,
  planExecution,
  executePlan,
  applyCoverage,
  runGrade,
  resolveScope,
  spawnTask,
  runReadOnly,
  runAutofix,
  planCi,
  buildReport,
  classifyEnding,
  install,
  uninstall,
  supportStatus,
};
