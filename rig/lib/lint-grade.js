'use strict';

// Small projected local-grade runner. Command execution is injected by the
// installed check-runner so the grade path shares its containment/policy gate.
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('./path-safety');
const { writeEvidence } = require('./evidence-artifacts');
const digest = (value) => crypto.createHash('sha256').update(Buffer.isBuffer(value) ? value : typeof value === 'string' ? value : JSON.stringify(value)).digest('hex');
const RECEIPT = 'reports/rig/lint-format-evidence.json';
const REQUEST = 'reports/rig/lint-format-context-review-request.json';

function snapshot(target, includeRig = false) {
  const rows = [];
  const walk = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!rel && (entry.name === '.git' || (!includeRig && entry.name === '.rig'))) continue;
      const name = path.join(rel, entry.name);
      const abs = path.join(dir, entry.name);
      if (!includeRig && name === path.join('reports', 'rig')) continue;
      const stat = fs.lstatSync(abs);
      const mode = stat.mode & 0o7777;
      if (stat.isSymbolicLink()) rows.push([name, `link:${fs.readlinkSync(abs)}`, mode]);
      else if (stat.isDirectory()) { if (includeRig) rows.push([name, 'directory', mode]); walk(abs, name); }
      else if (stat.isFile()) rows.push([name, digest(fs.readFileSync(abs)), mode]);
    }
  };
  walk(target);
  return rows.sort(([a], [b]) => a.localeCompare(b));
}

function inputFor(target, changed, commands) {
  try {
    const reviewed_files = [...new Set(changed)].sort().map((file) => ({ path: file, digest: digest(fs.readFileSync(containedPath(target, file))) }));
    const rule_sources = [...new Set(commands.map((cmd) => cmd.source?.split('#')[0]).filter(Boolean))].sort().map((file) => ({ path: file, digest: digest(fs.readFileSync(containedPath(target, file))) }));
    const input_digest = digest({ snapshot: snapshot(target), commands: commands.map(({ argv, cwd, source }) => ({ argv, cwd: cwd || '.', source: source || null })) });
    return { reviewed_files, rule_sources, input_digest };
  } catch { return null; }
}

function createGradeReviewRequest({ target, changed, commands }) {
  if (!Array.isArray(changed) || !Array.isArray(commands)) throw new Error('lint-format: review inputs must be lists');
  const input = inputFor(target, changed, commands);
  if (!input) throw new Error('lint-format: review inputs are unavailable or escape the repository');
  return { kind: 'lint-format-context-review', ...input };
}

function runGrade({ target, grade, changed, commands, context, execute }) {
  const level = { minimal: 1, mid: 2, maximal: 3 }[grade];
  if (!level || !Array.isArray(changed) || !Array.isArray(commands) || !commands.length || commands.some((cmd) => !Array.isArray(cmd.argv) || !cmd.argv.length) || typeof execute !== 'function') {
    return { status: 'coverage_gap', verdict: 'fail', grade: null, completed_grades: [], reason: 'lint-format: invalid grade, review input, or executable command binding' };
  }
  const input = inputFor(target, changed, commands);
  if (!input) return { status: 'coverage_gap', verdict: 'fail', grade: null, completed_grades: [], reason: 'lint-format: invalid grade, review input, or executable command binding' };
  const run = () => {
    const observed = [];
    const before = snapshot(target, true);
    for (const cmd of commands) {
      let result;
      try { result = execute(cmd); }
      catch { result = { exit_code: 1, status: 'boundary_violation', output_digest: null }; }
      observed.push({ cmd, result });
      const after = snapshot(target, true);
      const oldFiles = new Map(before.map(([file, ...state]) => [file, state]));
      const newFiles = new Map(after.map(([file, ...state]) => [file, state]));
      const changed_paths = [...new Set([...oldFiles.keys(), ...newFiles.keys()])]
        .filter((file) => JSON.stringify(oldFiles.get(file)) !== JSON.stringify(newFiles.get(file))).sort();
      if (changed_paths.length) return { observed, changed_paths, changes: changed_paths.map((file) => ({ path: file, before: oldFiles.get(file) || null, after: newFiles.get(file) || null })) };
      if (result.status !== 'completed' || result.exit_code !== 0) break;
    }
    return { observed };
  };
  const first = run();
  const observed = first.observed;
  if (first.changed_paths) return { status: observed.at(-1)?.result.status === 'completed' ? 'mutated' : observed.at(-1)?.result.status || 'mutated', verdict: 'fail', grade: null, completed_grades: [], reason: 'read-only lint-format command changed repository files', changed_paths: first.changed_paths, changes: first.changes, commands: observed.map(({ cmd, result }) => ({ ...cmd, result })) };
  const completed_grades = observed.length === commands.length && observed.every((entry) => entry.result.status === 'completed' && /^[a-f0-9]{64}$/.test(entry.result.output_digest || '')) && input.input_digest === inputFor(target, changed, commands)?.input_digest ? ['Policy'] : [];
  const failed = observed.some((entry) => entry.result.status === 'completed' && entry.result.exit_code !== 0);
  const steps = completed_grades.length ? ['policy_checks'] : [];
  const result = { grade: completed_grades.length ? 'Policy' : null, status: failed ? 'failed' : observed.find(entry => entry.result.status !== 'completed')?.result.status || (completed_grades.length ? 'completed' : 'coverage_gap'), verdict: completed_grades.length && !failed ? 'pass' : 'fail', files: changed, completed_grades, steps, executed_count: observed.length, commands: observed.map((entry) => ({ ...entry.cmd, result: entry.result })), evidence: { input_digest: input?.input_digest || null, output_digest: completed_grades.length ? digest(observed.map((entry) => entry.result)) : null } };
  if (failed) result.reason = `Policy command failed: ${observed.filter((entry) => entry.result.exit_code !== 0).map((entry) => entry.cmd.argv.join(' ')).join('; ')}`;
  if (completed_grades.length && !failed && level > 1) {
    const reviewed = new Set(input.reviewed_files.map((entry) => entry.path));
    const rules = new Set(input.rule_sources.map((entry) => entry.path));
    const valid = ['pass', 'fail'].includes(context?.verdict) && Array.isArray(context.findings) && (context.verdict === 'pass' ? context.findings.length === 0 : context.findings.length > 0) && input.rule_sources.length > 0 && context?.kind === 'lint-format-context-review' && context.input_digest === input.input_digest && JSON.stringify(context.reviewed_files) === JSON.stringify(input.reviewed_files) && JSON.stringify(context.rule_sources) === JSON.stringify(input.rule_sources) && typeof context.summary === 'string' && context.summary.trim() && Array.isArray(context.findings) && context.findings.every((item) => typeof item.file === 'string' && reviewed.has(item.file) && typeof item.rule === 'string' && rules.has(item.rule) && typeof item.meaning === 'string' && item.meaning.trim());
    if (!valid) { result.status = 'coverage_gap'; result.verdict = 'fail'; result.reason = 'Context review is absent, stale, or missing rule meaning'; }
    else {
      result.grade = 'Context'; completed_grades.push('Context'); steps.push('context_understanding');
      result.findings = context.findings;
      if (context.verdict === 'fail') { result.status = 'failed'; result.verdict = 'fail'; result.reason = 'Context review found policy violations'; return result; }
      if (level > 2) {
        const replay = run();
        result.executed_count += replay.observed.length;
        result.commands.push(...replay.observed.map(({ cmd, result }) => ({ ...cmd, phase: 'Evidence', result })));
        const abnormal = replay.observed.find(({ result }) => result.status !== 'completed' || result.exit_code !== 0)?.result;
        const ending = abnormal && (abnormal.status === 'completed' ? 'failed' : abnormal.status || 'runner_error');
        if (replay.changed_paths) return { ...result, status: ending || 'mutated', verdict: 'fail', reason: 'read-only Evidence replay changed repository files', changed_paths: replay.changed_paths, changes: replay.changes };
        if (ending) return { ...result, status: ending, verdict: 'fail', reason: `Evidence replay command ended with ${ending}` };
        if (JSON.stringify(replay.observed.map((entry) => entry.result)) !== JSON.stringify(observed.map((entry) => entry.result)) || input.input_digest !== inputFor(target, changed, commands)?.input_digest) { result.status = 'coverage_gap'; result.verdict = 'fail'; result.reason = 'Evidence command replay or input digest did not match'; }
        else {
          const receipt = { schema_version: 1, kind: 'lint-format-evidence', input_digest: input.input_digest, context_digest: digest(context), output_digest: result.evidence.output_digest, commands: observed.map(({ cmd, result: command }) => ({ argv: cmd.argv, cwd: cmd.cwd, ...command })) };
          writeEvidence(target, RECEIPT, `${JSON.stringify(receipt, null, 2)}\n`);
          result.evidence.receipt_path = RECEIPT; result.evidence.receipt_digest = digest(fs.readFileSync(containedPath(target, RECEIPT)));
          result.grade = 'Evidence'; completed_grades.push('Evidence'); steps.push('evidence_replay');
        }
      }
    }
  }
  return result;
}

function installedGradeInputs({ target, binding, scope }) {
  const grade = binding.grade;
  const components = (binding.components || []).map(component => ({ ...component, root: component.root || component.cwd || '.' }));
  const roles = grade === 'minimal' ? ['format_check'] : ['format_check', 'lint'];
  const selectedScope = scope || binding.scope || 'diff';
  const git = args => require('./spawn-guarded').spawnGuardedSync('git', ['-C', target, ...args], { encoding: 'utf8', shell: false, timeout: 3000 });
  const tracked = git(selectedScope === 'repo' ? ['ls-files', '-z', '--cached', '--others', '--exclude-standard'] : ['diff', '--name-only', '--diff-filter=ACMR', '-z', 'HEAD']);
  const untracked = selectedScope === 'repo' ? { status: 0, stdout: '' } : git(['ls-files', '--others', '--exclude-standard', '-z']);
  const gap = reason => ({ gap: { status: 'coverage_gap', verdict: 'fail', grade: null, completed_grades: [], reason, setup_guidance: 'Have the repository agent bind executable checks and an explicit supported scope in rig-lint-format.json, then approve the new proposal.' } });
  if (!components.some(component => !component.excluded)) return gap('lint-format: no selected executable components; provide an agent adaptation in rig-lint-format.json');
  if (tracked.status !== 0 || untracked.status !== 0) return gap('lint-format: file scope is unavailable; initialize git with a commit and retry');
  const candidates = [...new Set(`${tracked.stdout || ''}${untracked.stdout || ''}`.split('\0').filter(file => file && file !== '.rig' && !file.startsWith('.rig/') && !file.startsWith('reports/rig/')))].sort();
  for (const component of components) for (const source of component.sources || []) {
    try {
      if (digest(fs.readFileSync(containedPath(target, source.path))) !== source.digest) return gap(`lint-format: command source drift at ${source.path}; rediscover and approve a new binding`);
    } catch { return gap(`lint-format: command source is unavailable at ${source.path}; rediscover and approve a new binding`); }
  }
  const commands = [];
  const files = new Set();
  for (const component of components) {
    if (component.excluded) continue;
    for (const role of roles) {
      if (!component[role]?.argv) return gap(`lint-format: ${component.id || component.cwd || '.'} has no executable ${role} binding`);
      try {
        const owned = candidates.filter(file => {
          if ((binding.excluded || []).some(item => item.root === '.' || file.startsWith(`${item.root}/`))) return false;
          const owners = components.filter(item => !item.excluded && (item.root === '.' || file.startsWith(`${item.root}/`))).sort((a, b) => b.root.length - a.root.length);
          return owners[0] === component;
        });
        const command = require('./lint-discovery').scopedCommand({ ...component[role], source: component[role].source || component.manifest }, component, owned, selectedScope);
        for (const file of command.scoped_files) files.add(component.root === '.' ? file : `${component.root}/${file}`);
        if (!command.skip) commands.push(command);
      } catch (error) { return gap(`lint-format: ${component.id || component.root} ${role}: ${error.message}`); }
    }
  }
  const changed = [...files].sort();
  const contextPath = '.rig/lint-format/context-review.json';
  let context = null;
  try { context = JSON.parse(fs.readFileSync(containedPath(target, contextPath), 'utf8')); } catch {}
  return { target, grade, changed, commands, context, contextPath, scope: selectedScope };
}

function runInstalledGrade({ target, binding, execute, scope, inputs: suppliedInputs }) {
  const inputs = suppliedInputs || installedGradeInputs({ target, binding, scope });
  if (inputs.gap) return inputs.gap;
  if (!inputs.commands.length) return { status: 'no_changes', verdict: 'pass', grade: null, completed_grades: [], commands: [], reason: 'No selected files require checks; no grade was claimed', scope: inputs.scope };
  const { grade, changed, commands, context, contextPath } = inputs;
  const result = runGrade({ target, grade, changed, commands, context, execute });
  if (result.status === 'coverage_gap') result.setup_guidance = 'Provide the named executable checker and its dependencies, or approve a valid repository command; semantic review gaps require the current bound review.';
  if (!result.reason && result.status === 'coverage_gap') result.reason = `lint-format Policy could not be observed: ${result.commands.map((item) => `${item.argv.join(' ')}=${item.result.status}`).join('; ')}`;
  if (grade !== 'minimal' && result.status === 'coverage_gap' && result.completed_grades.includes('Policy') && !result.completed_grades.includes('Context')) {
    writeEvidence(target, REQUEST, `${JSON.stringify(createGradeReviewRequest({ target, changed, commands }), null, 2)}\n`);
    result.review_request_path = REQUEST;
    result.reason += `; review the request and save the completed review to ${contextPath}`;
  }
  return result;
}

module.exports = { createGradeReviewRequest, runGrade, runInstalledGrade, installedGradeInputs };
