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

function snapshot(target) {
  const rows = [];
  const walk = (dir, rel = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (['.git', '.rig', 'node_modules'].includes(entry.name)) continue;
      const name = path.join(rel, entry.name);
      const abs = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(abs, name);
      else if (entry.isFile() && name !== RECEIPT && name !== REQUEST) rows.push([name, digest(fs.readFileSync(abs)), fs.statSync(abs).mode & 0o777]);
    }
  };
  walk(target);
  return rows.sort(([a], [b]) => a.localeCompare(b));
}

function inputFor(target, changed, commands) {
  try {
    const reviewed_files = [...new Set(changed)].sort().map((file) => ({ path: file, digest: digest(fs.readFileSync(containedPath(target, file))) }));
    const rule_sources = [...new Set(commands.map((cmd) => cmd.source).filter(Boolean))].sort().map((file) => ({ path: file, digest: digest(fs.readFileSync(containedPath(target, file))) }));
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
    const before = snapshot(target);
    for (const cmd of commands) {
      let result;
      try { result = execute(cmd); }
      catch { result = { exit_code: 1, status: 'boundary_violation', output_digest: null }; }
      observed.push({ cmd, result });
      const after = snapshot(target);
      const oldFiles = new Map(before.map(([file, ...state]) => [file, state]));
      const newFiles = new Map(after.map(([file, ...state]) => [file, state]));
      const changed_paths = [...new Set([...oldFiles.keys(), ...newFiles.keys()])]
        .filter((file) => JSON.stringify(oldFiles.get(file)) !== JSON.stringify(newFiles.get(file))).sort();
      if (changed_paths.length) return { observed, changed_paths, changes: changed_paths.map((file) => ({ path: file, before: oldFiles.get(file) || null, after: newFiles.get(file) || null })) };
      if (result.status === 'completed' && result.exit_code !== 0) break;
    }
    return { observed };
  };
  const first = run();
  const observed = first.observed;
  if (first.changed_paths) return { status: 'mutated', verdict: 'fail', grade: null, completed_grades: [], reason: 'read-only lint-format command changed repository files', changed_paths: first.changed_paths, changes: first.changes, commands: observed.map(({ cmd, result }) => ({ ...cmd, result })) };
  const completed_grades = observed.length && observed.every((entry) => entry.result.status === 'completed' && /^[a-f0-9]{64}$/.test(entry.result.output_digest || '')) && input.input_digest === inputFor(target, changed, commands)?.input_digest ? ['Policy'] : [];
  const failed = completed_grades.length && observed.some((entry) => entry.result.exit_code !== 0);
  const steps = completed_grades.length ? ['policy_checks'] : [];
  const result = { grade: completed_grades.length ? 'Policy' : null, status: completed_grades.length ? failed ? 'failed' : 'completed' : 'coverage_gap', verdict: completed_grades.length && !failed ? 'pass' : 'fail', files: changed, completed_grades, steps, commands: observed.map((entry) => ({ ...entry.cmd, result: entry.result })), evidence: { input_digest: input?.input_digest || null, output_digest: completed_grades.length ? digest(observed.map((entry) => entry.result)) : null } };
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
        if (replay.changed_paths) return { ...result, status: 'mutated', verdict: 'fail', reason: 'read-only Evidence replay changed repository files', changed_paths: replay.changed_paths, changes: replay.changes };
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

function runInstalledGrade({ target, binding, execute }) {
  const grade = binding.grade;
  const roles = grade === 'minimal' ? ['format_check'] : ['format_check', 'lint'];
  for (const component of binding.components || []) {
    for (const role of roles) {
      if (!component[role]?.argv) return { status: 'coverage_gap', verdict: 'fail', completed_grades: [], reason: `lint-format: ${component.id || component.cwd || '.'} has no executable ${role} binding` };
    }
  }
  const commands = (binding.components || []).flatMap((component) => roles.map((role) => component[role]?.argv && ({ ...component[role], cwd: component[role].cwd || component.cwd || '.', source: component.manifest })).filter(Boolean));
  const git = (args) => require('./spawn-guarded').spawnGuardedSync('git', ['-C', target, ...args], { encoding: 'utf8', shell: false, timeout: 3000 });
  const tracked = git(['diff', '--name-only', '-z', 'HEAD']);
  const untracked = git(['ls-files', '--others', '--exclude-standard', '-z']);
  if (tracked.status !== 0 || untracked.status !== 0) return { status: 'coverage_gap', verdict: 'fail', reason: 'lint-format: changed-file scope is unavailable; initialize git and retry' };
  const changed = [...new Set(`${tracked.stdout || ''}${untracked.stdout || ''}`.split('\0').filter((file) => file && file !== '.rig' && !file.startsWith('.rig/') && !file.startsWith('reports/rig/')))].sort();
  const contextPath = '.rig/lint-format/context-review.json';
  let context = null;
  try { context = JSON.parse(fs.readFileSync(containedPath(target, contextPath), 'utf8')); } catch {}
  const result = runGrade({ target, grade, changed, commands, context, execute });
  if (!result.reason && result.status === 'coverage_gap') result.reason = `lint-format Policy could not be observed: ${result.commands.map((item) => `${item.argv.join(' ')}=${item.result.status}`).join('; ')}`;
  if (grade !== 'minimal' && result.status === 'coverage_gap' && result.completed_grades.includes('Policy') && !result.completed_grades.includes('Context')) {
    writeEvidence(target, REQUEST, `${JSON.stringify(createGradeReviewRequest({ target, changed, commands }), null, 2)}\n`);
    result.review_request_path = REQUEST;
    result.reason += `; review the request and save the completed review to ${contextPath}`;
  }
  return result;
}

module.exports = { createGradeReviewRequest, runGrade, runInstalledGrade };
