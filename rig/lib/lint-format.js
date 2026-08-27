'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { containedPath } = require('./path-safety');

const ECOSYSTEM_SIGNALS = [
  { name: 'package.json', ecosystem: 'js' },
  { name: 'pnpm-lock.yaml', ecosystem: 'js' },
  { name: 'pyproject.toml', ecosystem: 'python' },
  { name: 'ruff.toml', ecosystem: 'python' },
  { name: 'Cargo.toml', ecosystem: 'rust' },
  { name: 'go.mod', ecosystem: 'go' },
];

const KNOWN_LINTERS = /(eslint|biome|pylint|flake8|ruff|golangci-lint|rubocop|standard)/i;
const KNOWN_FORMATTERS = /(prettier|black|gofmt|rustfmt|dprint)/i;

function digest(value) {
  return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
}

function walkDirs(root, target, out, depth = 0) {
  if (depth > 6) return;
  const abs = path.join(target, root);
  if (!fs.existsSync(abs)) return;
  const entries = fs.readdirSync(abs, { withFileTypes: true });
  const signals = [];
  let ecosystem = null;
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    const match = ECOSYSTEM_SIGNALS.find((sig) => sig.name === entry.name);
    if (match) {
      signals.push(entry.name);
      ecosystem = match.ecosystem;
      continue;
    }
    if (/\.(conf|toml|yaml|yml|json)$/i.test(entry.name)) {
      try {
        const body = fs.readFileSync(path.join(abs, entry.name), 'utf8');
        if (/role\s*=\s*(formatter|linter)/i.test(body)) {
          signals.push(entry.name);
          ecosystem = ecosystem || 'unknown';
        }
      } catch { /* ignore */ }
    }
  }
  if (signals.length) out.push({ root: root || '.', ecosystem, signals });
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    walkDirs(path.join(root, entry.name), target, out, depth + 1);
  }
}

function discoverComponents(target) {
  const out = [];
  walkDirs('', target, out);
  return out;
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

// A component leaf binds to conventional package scripts, not tool-name
// heuristics: `format:check` is the read-only formatter verifier, `format` is
// the explicit (mutating) fix, and `lint` is the linter. Keeping these three
// role→script names distinct is what lets the installed check stay read-only
// while the maximal grade still records a real fix command. discoverCommands()
// stays as the frozen semantic-discovery oracle (AT-LF-3) and is deliberately
// not reused here.
const ROLE_SCRIPT = { format_check: 'format:check', format: 'format', lint: 'lint' };

function commandForRole(target, component, role) {
  const script = ROLE_SCRIPT[role];
  const manifest = path.join(component.root, 'package.json');
  const abs = path.join(target, manifest);
  if (component.ecosystem !== 'js' || !fs.existsSync(abs)) {
    return { coverage_gap: `${component.root}: ${script} task missing` };
  }
  let scripts;
  try {
    scripts = JSON.parse(fs.readFileSync(abs, 'utf8')).scripts || {};
  } catch (error) {
    return { coverage_gap: `${manifest}: ${error.message}` };
  }
  if (!scripts[script]) {
    return { coverage_gap: `${component.root}: ${script} task missing` };
  }
  return { argv: ['npm', 'run', '--silent', script], cwd: component.root };
}

function buildBinding(target, grade, ci = null) {
  const components = discoverComponents(target).map((component) => {
    const manifest = path.join(component.root, component.signals.find((signal) => signal === 'package.json') || component.signals[0]);
    const abs = path.join(target, manifest);
    return {
      id: component.root,
      ...component,
      manifest,
      manifest_digest: fs.existsSync(abs) ? digest(fs.readFileSync(abs)) : null,
      format_check: commandForRole(target, component, 'format_check'),
      format: commandForRole(target, component, 'format'),
      lint: commandForRole(target, component, 'lint'),
    };
  });
  const commands = (role) => components.map((component) => component[role]);
  const gaps = (role) => commands(role).filter((entry) => entry.coverage_gap).map((entry) => entry.coverage_gap);
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
  return {
    disposition: 'executable',
    engine: 'component-lint-format-v1',
    grade,
    components,
    checks,
  };
}

function validateBindingSources(target, binding) {
  for (const component of binding?.components || []) {
    const abs = containedPath(target, component.manifest);
    const current = fs.existsSync(abs) ? digest(fs.readFileSync(abs)) : null;
    if (current !== component.manifest_digest) {
      throw new Error(`lint-format: command source drift at ${component.manifest}`);
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
          const doc = JSON.parse(fs.readFileSync(abs, 'utf8'));
          const parts = ref.split('.');
          let node = doc;
          for (const part of parts) node = node && node[part];
          source_snapshot = node;
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

const MEMORY_GUARD_SCRIPT = path.join(__dirname, 'memory-guarded-exec.js');

// Shared synchronous command runner for runGrade and runReadOnly. Stays
// spawnSync-based (not async) because both frozen Gate 1 oracle tests
// (tests/advanced-oracle.test.js, wiki/gate1/testing-infrastructure.manifest)
// call these functions synchronously and cannot be edited. A memory ceiling
// needs to poll RSS while the command runs, which spawnSync's own blocking
// wait cannot do -- that path delegates to memory-guarded-exec.js, a
// separate process free to poll asynchronously, and reports back through a
// result file so this call can stay a plain, synchronous spawnSync.
function runCommand(argv, { cwd, timeoutMs, memoryLimitMb } = {}) {
  const effectiveTimeout = timeoutMs || 10 * 60 * 1000;
  if (!memoryLimitMb) {
    const result = spawnSync(argv[0], argv.slice(1), { cwd, encoding: 'utf8', shell: false, timeout: effectiveTimeout });
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
  const outer = spawnSync(process.execPath, [MEMORY_GUARD_SCRIPT, resultFile, String(memoryLimitMb), String(effectiveTimeout), ...argv], {
    cwd, encoding: 'utf8', shell: false, timeout: effectiveTimeout + 5000,
  });
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
    const result = runCommand(cmd.argv, { cwd, timeoutMs: cmd.timeout_ms, memoryLimitMb: cmd.memory_limit_mb });
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

function runReadOnly(target, commands) {
  const preState = snapshotDir(target);
  const changed_paths = [];
  for (const cmd of commands) {
    let cwd;
    try {
      cwd = taskCwd(target, cmd.cwd);
    } catch {
      return { status: 'boundary_violation', changed_paths };
    }
    const result = runCommand(cmd.argv, { cwd, timeoutMs: cmd.timeout_ms, memoryLimitMb: cmd.memory_limit_mb });
    if (result.status === 'timeout' || result.status === 'memory_exceeded') return { status: result.status, changed_paths };
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
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (SNAPSHOT_SKIP.has(entry.name)) continue;
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs);
      else {
        const bytes = fs.readFileSync(abs);
        map.set(path.relative(root, abs), digest(bytes));
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
  spawnSync(cmd.argv[0], cmd.argv.slice(1), { cwd: target, encoding: 'utf8', shell: false });
  if (cmd.verify) {
    const check = spawnSync(cmd.verify[0], cmd.verify.slice(1), { cwd: target, encoding: 'utf8', shell: false });
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
  runReadOnly,
  runAutofix,
  planCi,
  buildReport,
  classifyEnding,
  install,
  uninstall,
  supportStatus,
};
