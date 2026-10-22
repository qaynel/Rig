'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const {
  spawnGuardedSync,
  isolatedTaskEnv,
  executableAvailable,
} = require('./spawn-guarded');
const { runTaskSandboxed, taskCommandSpec } = require('./sandbox');
const { containedPath } = require('./path-safety');
const { verifyTrustRootApproval } = require('./trust-root');
const { scriptPath: MEMORY_GUARD_SCRIPT } = require('./memory-guarded-exec');
const { resumeInstall, uninstall: uninstallLifecycle } = require('./lifecycle');
const { writeEvidence } = require('./evidence-artifacts');

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
  return crypto.createHash('sha256').update(Buffer.isBuffer(value) || typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function normalizeTaskOutput(value, scratch) {
  return String(value || '').split(scratch || '\0').join('[TASK_TMP]');
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
  const item = { argv, cwd: component.root, source, network: 'none' };
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

function buildBinding(target, grade, ci = null, agentSelection = null) {
  const discovery = require('./lint-discovery');
  const agent = agentSelection ? discovery.bindAgentSelection(target, grade, agentSelection) : discovery.loadAgentBinding(target, grade);
  if (agent) return { ...agent, ci };
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
    checks['lint-format-ci-gate-and-explicit-fix'] = {
      coverage_gap: 'local Evidence uses rig check review and replay; CI enforcement requires a separately approved CI binding',
    };
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

const { planExecution, createPlanApprovalChallenge, authorizeExecution, authorizeCommands, consumeTaskPermit } = require('./task-consent');

function executePlan(plan, approval) {
  if (!plan?.target) throw new Error('executePlan: valid plan and approval required');
  const authorized = authorizeExecution(plan, approval);
  if (authorized.status !== 'authorized') return authorized;
  const command_results = [];
  for (const cmd of plan.commands) {
    let cwd;
    try { cwd = taskCwd(plan.target, cmd.cwd); }
    catch { return { status: 'boundary_violation', reason: 'approved working directory escapes repository', command_results }; }
    const before = cmd.role === 'autofix' ? null : snapshotDir(plan.target);
    const observed = runCommand(cmd.argv, {
      permit: authorized.permit,
      target: plan.target,
      cwd,
      timeoutMs: cmd.timeout_ms,
      memoryLimitMb: cmd.memory_limit_mb,
      maxOutputBytes: cmd.max_output_bytes,
      network: cmd.network === true || cmd.network === 'required',
      dependencies: cmd.dependencies,
    });
    const result = {
      status: observed.status,
      exit_code: observed.exit_code,
      output_digest: observed.output_digest,
    };
    if (before) {
      const changed_paths = diffSnapshots(before, snapshotDir(plan.target));
      if (changed_paths.length) return { status: 'mutated', changed_paths, changes: changed_paths.map((file) => ({ path: file, before: before.get(file) || null, after: snapshotDir(plan.target).get(file) || null })), command_results: [...command_results, result] };
    }
    command_results.push(result);
    if (result.status !== 'completed' || result.exit_code !== 0) {
      return { status: result.status === 'completed' ? 'failed' : result.status, command_results };
    }
  }
  return { status: 'executed', command_results, executed_count: command_results.length };
}

function createCoverageApprovalChallenge(target, plan) {
  const plan_digest = digest({ target: fs.realpathSync(target), plan });
  return { plan_digest, message: `rig-coverage-approval\ntarget=${fs.realpathSync(target)}\nplan=${plan_digest}\n` };
}

function applyCoverage(target, plan, approval) {
  const challenge = createCoverageApprovalChallenge(target, plan);
  if (!approval || approval.kind !== 'coverage-approval' || approval.plan_digest !== challenge.plan_digest || approval.approval?.method !== 'external-sshsig') throw new Error('applyCoverage: signed exact coverage approval required');
  verifyTrustRootApproval(target, { identity: approval.approval.identity, namespace: 'rig-coverage-approval', message: challenge.message, signature: approval.approval.signature });
  // Reuse the durable installer; pending/applied records, preimages, resume,
  // and removal have one authority instead of an in-memory imitation.
  const lock = require('./apply').acquireLock(target, 'lint-coverage');
  try {
    const write = require('./payload').journalWriter(target, { transactionOwner: challenge.plan_digest });
    for (const item of plan.writes || []) {
      if (!item || typeof item.path !== 'string' || typeof item.content !== 'string') throw new Error('applyCoverage: malformed write');
      containedPath(target, item.path);
    }
    write.begin();
    for (const item of plan.writes || []) {
      const abs = containedPath(target, item.path);
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      write(target, item.path, item.content);
    }
    write.finish();
    return { unprotected: (plan.excluded || []).map((entry) => entry.component), manifest_records: require('./lifecycle').readManifest(target).records };
  } finally { fs.rmSync(lock, { force: true }); }
}

// A working directory is safe only when it resolves inside the repository
// even through symlinks (AT-LF-21/24) -- the same guard runReadOnly already
// used, now shared so runGrade cannot be the one execution path that skips
// it (the lint/format executor is the guarantee's most central path).
function taskCwd(target, rel) {
  if (!rel || rel === '.') return fs.realpathSync(target);
  return containedPath(target, rel);
}

function spawnTask(argv, options) {
  if (options?.target) {
    return runTaskSandboxed({
      target: options.target,
      cwd: options.cwd || options.target,
      argv,
      env: isolatedTaskEnv(),
      timeoutMs: options.timeout,
      maxBuffer: options.maxBuffer,
      network: options.network === true,
      trustedReadDirs: options.trustedReadDirs,
    });
  }
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
function runCommand(argv, {
  target,
  cwd,
  permit,
  network = false,
  timeoutMs,
  memoryLimitMb,
  cancelled = false,
  dependencies = [],
  maxOutputBytes,
} = {}) {
  const approvedCommand = target && consumeTaskPermit(permit, target, argv, cwd || target, network);
  if (!approvedCommand) return { exit_code: 1, status: 'not_authorized', output_digest: digest('') };
  timeoutMs = approvedCommand.timeout_ms ?? approvedCommand.timeoutMs;
  memoryLimitMb = approvedCommand.memory_limit_mb ?? approvedCommand.memoryLimitMb;
  cancelled = approvedCommand.cancelled === true;
  dependencies = approvedCommand.dependencies || [];
  maxOutputBytes = approvedCommand.max_output_bytes ?? approvedCommand.maxOutputBytes;
  if (cancelled) {
    return { exit_code: 1, status: 'cancelled', output_digest: digest('') };
  }
  if (!executableAvailable(argv[0], { cwd: cwd || target, env: isolatedTaskEnv() })) return { exit_code: 1, status: 'command_not_found', output_digest: digest('') };
  if (dependencies.some((dependency) => !executableAvailable(dependency, {
    cwd,
    env: isolatedTaskEnv(),
  }))) {
    return { exit_code: 1, status: 'missing_dependency', output_digest: digest('') };
  }
  const effectiveTimeout = timeoutMs || 10 * 60 * 1000;
  const outputLimit = Number.isInteger(maxOutputBytes) && maxOutputBytes > 0 ? maxOutputBytes : undefined;
  if (!memoryLimitMb) {
    const result = spawnTask(argv, {
      target,
      cwd,
      timeout: effectiveTimeout,
      network,
      ...(outputLimit ? { maxBuffer: outputLimit } : {}),
    });
    const output = `${normalizeTaskOutput(result.stdout, result.scratch)}\n${normalizeTaskOutput(result.stderr, result.scratch)}`;
    return {
      exit_code: result.status == null ? 1 : result.status,
      status: result.unavailable ? 'filesystem_isolation_unavailable' : (result.error?.code === 'ETIMEDOUT' ? 'timeout'
        : outputLimit && (result.error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || result.signal) ? 'partial_output'
          : result.signal ? 'signalled'
            : result.error?.code === 'ENOENT' ? 'command_not_found' : 'completed'),
      output_digest: digest(output),
    };
  }
  const resultFile = path.join(os.tmpdir(), `rig-mem-guard-${process.pid}-${crypto.randomBytes(6).toString('hex')}.json`);
  // The watcher enforces the real timeout itself so it can also kill its own
  // child on expiry; this outer timeout is only a safety net against the
  // watcher itself hanging.
  const task = taskCommandSpec({
    target, cwd, argv, env: isolatedTaskEnv(), network,
    captureOutputLimit: outputLimit || 1024 * 1024,
  });
  if (task.unavailable) return { exit_code: 1, status: task.unavailable, output_digest: digest('') };
  const outer = spawnGuardedSync(process.execPath, [
    MEMORY_GUARD_SCRIPT, resultFile, String(memoryLimitMb), String(effectiveTimeout),
    ...(task.captureSignal ? ['--capture-signal', String(outputLimit || 1024 * 1024)] : []), task.command, ...task.args,
  ], {
    cwd: target,
    env: task.env,
    shell: false,
    encoding: 'utf8',
    timeout: effectiveTimeout + 5000,
    ...(outputLimit ? { maxBuffer: outputLimit } : {}),
  });
  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(resultFile, 'utf8'));
  } catch {
    meta = {
      killed_for: outer.error?.code === 'ETIMEDOUT' ? 'timeout'
        : outputLimit && (outer.error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' || outer.signal) ? 'partial_output'
          : outer.error?.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER' ? 'partial_output' : null,
      code: 1,
      signal: outer.signal || null,
    };
  } finally {
    fs.rmSync(resultFile, { force: true });
    task.cleanup();
  }
  const output = `${normalizeTaskOutput(outer.stdout, task.env.TMPDIR)}\n${normalizeTaskOutput(outer.stderr, task.env.TMPDIR)}`;
  return {
    exit_code: meta.code == null ? 1 : meta.code,
    status: meta.killed_for || (meta.signal ? 'signalled' : 'completed'),
    ...(meta.signal ? { signal: meta.signal } : {}),
    output_digest: digest(output),
  };
}

function createGradeReviewRequest({ target, changed, commands }) {
  return require('./lint-grade').createGradeReviewRequest({ target, changed, commands });
}

function runGrade({ target, grade, changed, commands, context, ci, plan, approval }) {
  if (!target || !['minimal', 'mid', 'maximal'].includes(grade) || !Array.isArray(changed) || !Array.isArray(commands) || !commands.length) return { status: 'coverage_gap', verdict: 'fail', completed_grades: [], reason: 'a concrete grade, file scope and executable commands are required' };
  const auth = authorizeCommands(target, grade === 'maximal' ? [...commands, ...commands] : commands, { plan, approval });
  if (auth.status !== 'authorized') return { ...auth, verdict: 'fail', completed_grades: [] };
  const execute = (cmd) => {
    let cwd;
    try {
      cwd = taskCwd(target, cmd.cwd);
    } catch { return { exit_code: 1, status: 'boundary_violation', output_digest: digest('') }; }
    const result = runCommand(cmd.argv, {
      permit: auth.permit,
      target,
      cwd,
      network: cmd.network === true || cmd.network === 'required',
      timeoutMs: cmd.timeout_ms || cmd.timeoutMs,
      memoryLimitMb: cmd.memory_limit_mb,
      cancelled: cmd.cancelled,
      dependencies: cmd.dependencies,
      maxOutputBytes: cmd.max_output_bytes,
    });
    return { ...result, cwd };
  };
  const result = require('./lint-grade').runGrade({ target, grade, changed, commands, context, execute });
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

function runReadOnly(target, commands, options = {}) {
  const auth = authorizeCommands(target, commands, options);
  if (auth.status !== 'authorized') return auth;
  const preState = snapshotDir(target);
  const changed_paths = [];
  const outcomes = [];
  for (const cmd of commands) {
    let cwd;
    try {
      cwd = taskCwd(target, cmd.cwd);
    } catch {
      return { status: 'boundary_violation', changed_paths };
    }
    const result = runCommand(cmd.argv, {
      permit: auth.permit,
      target,
      cwd,
      network: cmd.network === true || cmd.network === 'required',
      timeoutMs: cmd.timeout_ms || cmd.timeoutMs,
      memoryLimitMb: cmd.memory_limit_mb,
      cancelled: cmd.cancelled,
      dependencies: cmd.dependencies,
      maxOutputBytes: cmd.max_output_bytes,
    });
    const postState = snapshotDir(target);
    const diff = diffSnapshots(preState, postState);
    if (diff.length) {
      for (const rel of diff) if (!changed_paths.includes(rel)) changed_paths.push(rel);
      return { status: result.status === 'completed' ? 'mutated' : result.status, changed_paths, changes: changed_paths.map((file) => ({ path: file, before: preState.get(file) || null, after: postState.get(file) || null })) };
    }
    if (result.status !== 'completed' || result.exit_code !== 0) {
      return { status: result.status === 'completed' ? 'failed' : (result.status || 'runner_error'), changed_paths, commands: [...outcomes, { status: result.status || 'runner_error', exit_code: result.exit_code ?? null }] };
    }
    outcomes.push({ status: 'clean', exit_code: 0 });
  }
  const unavailable = outcomes.find((outcome) => outcome.status === 'network_isolation_unavailable'
    || outcome.status === 'filesystem_isolation_unavailable');
  return { status: unavailable?.status || 'clean', changed_paths, commands: outcomes };
}

// Only protected Rig and Git authority storage is outside the source snapshot.
const SNAPSHOT_SKIP = new Set(['.git', '.rig']);

function snapshotDir(root) {
  const map = new Map();
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const name of fs.readdirSync(dir)) {
      if (dir === root && SNAPSHOT_SKIP.has(name)) continue;
      const abs = path.join(dir, name);
      let stat;
      try { stat = fs.lstatSync(abs); } catch { continue; }
      const rel = path.relative(root, abs);
      const mode = stat.mode & 0o7777;
      if (stat.isSymbolicLink()) map.set(rel, `link:${mode}:${fs.readlinkSync(abs)}`);
      else if (stat.isDirectory()) {
        map.set(rel, `directory:${mode}`);
        walk(abs);
      } else if (stat.isFile()) map.set(rel, `file:${mode}:${digest(fs.readFileSync(abs))}`);
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

const AUTOFIX_HALT_STATUSES = new Set(['timeout', 'memory_exceeded', 'memory_ceiling_unavailable']);

// The approved plan binds the exact fix argv, the verify argv, the network grant,
// the limits and the target, so a signature for one fix cannot authorise another.
function planAutofix(target, cmd) {
  if (!cmd || !Array.isArray(cmd.argv) || cmd.argv.length === 0) throw new Error('runAutofix: fix argv required');
  if (!Array.isArray(cmd.verify) || cmd.verify.length === 0) throw new Error('runAutofix: a verification command (verify) is required before any fix runs');
  const limits = {
    cwd: cmd.cwd || '.',
    source: cmd.source,
    network: cmd.network === true || cmd.network === 'required',
    dependencies: cmd.dependencies || [],
    timeout_ms: cmd.timeout_ms || cmd.timeoutMs || null,
    memory_limit_mb: cmd.memory_limit_mb || null,
    max_output_bytes: cmd.max_output_bytes || null,
  };
  return planExecution({
    target,
    commands: [{
      ...limits,
      role: 'autofix',
      argv: cmd.argv,
    }, { ...limits, role: 'verify', argv: cmd.verify }],
  });
}

// AT-LF-12: the fix runs only under its own signed, single-use plan approval
// (verified against the Gate 1 key), then the verify command is actually run
// and its real result is reported. Nothing is committed.
function runAutofix(target, cmd, approval) {
  if (!approval) throw new Error('runAutofix: approval required');
  const plan = planAutofix(target, cmd);
  const authorised = executePlan(plan, approval);
  if (authorised.status === 'not_authorized') {
    throw new Error('runAutofix: approval not authorized or already consumed');
  }
  if (authorised.status !== 'executed') {
    if (AUTOFIX_HALT_STATUSES.has(authorised.status)) {
      return { verification: 'not_run', status: authorised.status };
    }
    if (authorised.command_results?.length) {
      return {
        verification: 'fail',
        status: authorised.status,
        fix_status: authorised.command_results[0].status,
      };
    }
    return { verification: 'not_run', status: authorised.status, ...(authorised.command_results ? { fix_status: authorised.command_results[0]?.status || authorised.status } : {}) };
  }
  const fixResult = authorised.command_results[0] || { status: 'runner_error', exit_code: 1 };
  if (AUTOFIX_HALT_STATUSES.has(fixResult.status)) {
    return { verification: 'not_run', status: fixResult.status };
  }
  const verifyResult = authorised.command_results[1] || { status: 'runner_error', exit_code: 1 };
  if (AUTOFIX_HALT_STATUSES.has(verifyResult.status)) {
    return { verification: 'not_run', status: verifyResult.status };
  }
  const passed = verifyResult.status === 'completed' && verifyResult.exit_code === 0;
  return { verification: passed ? 'pass' : 'fail', status: verifyResult.status, fix_status: fixResult.status };
}

function planCi({ grade, target, provider, approved, spec }) {
  if (grade !== 'maximal') return { action: 'none' };
  if (!target) return { status: 'coverage_gap', reason: 'repository target is required before selecting a CI adapter' };
  return require('./ci-adapters').planCiIntegration(target, { provider, approved: approved === true, spec });
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

function classifyEnding(result = {}) {
  const status = result.kind || result.status;
  return { status, passing: false, blocking: true };
}

function install(target, opts = {}) {
  const grade = opts.grade || 'minimal';
  const binding = opts.binding || buildBinding(target, grade, opts.ci || null);
  const bindingDigest = digest(binding);
  const operations = [
    {
      path: '.rig/lint-format/plan.json',
      content: `${JSON.stringify({ kind: 'lint-format-install-plan', grade, binding_digest: bindingDigest }, null, 2)}\n`,
    },
    {
      path: '.rig/lint-format/binding.json',
      content: `${JSON.stringify(binding, null, 2)}\n`,
    },
    {
      path: '.rig/lint-format/receipt.json',
      content: `${JSON.stringify({
        kind: 'lint-format-install-receipt',
        grade,
        binding_digest: bindingDigest,
        support_claim: binding.support_claim,
      }, null, 2)}\n`,
    },
  ];
  // lint-format's three binding artifacts are a service-owned transaction,
  // but share the repository lifecycle journal and its resume/CAS behavior.
  const result = resumeInstall(target, { operations });
  return { supported: result.complete, manifest: { records: result.records } };
}

function uninstall(target, manifest) {
  if (!manifest || !Array.isArray(manifest.records)) return { removed: false };
  // The shared journal is the deletion authority; the returned install
  // manifest is only a completion token and cannot narrow repository removal.
  return uninstallLifecycle(target);
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
  ...require('./lint-format-setup'),
  ...require('./lint-discovery'),
  discoverComponents,
  recommendTooling,
  discoverCommands,
  buildBinding,
  validateBindingSources,
  finalizeSelection,
  planExecution,
  createPlanApprovalChallenge,
  executePlan,
  applyCoverage,
  createCoverageApprovalChallenge,
  runGrade,
  createGradeReviewRequest,
  runCommand,
  resolveScope,
  spawnTask,
  runReadOnly,
  snapshotDir,
  diffSnapshots,
  planAutofix,
  runAutofix,
  planCi,
  buildReport,
  classifyEnding,
  install,
  uninstall,
  supportStatus,
};
