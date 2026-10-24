'use strict';

// Durable run state for the AI-SDLC harness, all under <repo>/.rig/:
//   run.json         phase, attempt and stop reason (written by the run driver)
//   journal.json     idempotent side effects, keyed by name
//   evidence/*.json  per-step evidence; complete() refuses unless every one parses
//   complete         written only when every evidence record parses
//   tdd/<pkg>.json   red/green evidence bound to a candidate digest
// Every write lands in a temp file in the same directory, then renames over the target.

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');
const { acquireLock } = require('../../lib/apply');
const { sourceDigest } = require('./release-evidence');
const { containedPath } = require('../../lib/path-safety');

const RIG = '.rig';
const FULL_GATE = 'full gate';

const rigPath = (repo, ...parts) => path.join(repo, RIG, ...parts);
const journalFile = (repo) => rigPath(repo, 'journal.json');
const tddFile = (repo, pkg) => {
  if (typeof pkg !== 'string' || !/^[A-Za-z0-9_-]+$/.test(pkg)) throw new Error('invalid package id');
  return containedPath(repo, `.rig/tdd/${pkg}.json`);
};
const toPosix = (p) => p.split(path.sep).join('/');

function writeAtomic(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${crypto.randomBytes(4).toString('hex')}.tmp`;
  fs.writeFileSync(tmp, text);
  fs.renameSync(tmp, file);
}

function writeJson(file, value) {
  writeAtomic(file, `${JSON.stringify(value, null, 2)}\n`);
}

// Returns {ok, value} or {ok:false, error:'missing'|'unparsable'}.
function readJson(file) {
  if (!fs.existsSync(file)) return { ok: false, error: 'missing' };
  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return { ok: false, error: 'unparsable' };
  }
  return value && typeof value === 'object' && !Array.isArray(value) ? { ok: true, value } : { ok: false, error: 'unparsable' };
}

// A recorded state file that exists but cannot be parsed must never be silently overwritten.
function loadOrEmpty(file, empty) {
  const r = readJson(file);
  if (r.ok) return r.value;
  if (r.error === 'missing') return empty;
  throw new Error(`${path.basename(file)} is unparsable: refusing to overwrite recorded state`);
}

function evidenceOf(result) {
  if (typeof result === 'string') return result;
  if (result && typeof result.receipt === 'string') return result.receipt;
  return JSON.stringify(result) ?? String(result);
}

const oneLine = (text) => String(text).replace(/\s+/g, ' ').trim();

function read(repo) {
  const run = readJson(rigPath(repo, 'run.json'));
  const journal = readJson(journalFile(repo));
  const evidence = {};
  if (journal.ok && journal.value.done) {
    for (const [key, entry] of Object.entries(journal.value.done)) evidence[key] = evidenceOf(entry.result);
  }
  if (!run.ok) {
    return {
      phase: null,
      last_attempt: null,
      stop_reason: null,
      evidence,
      next_action: `Run record .rig/run.json is ${run.error}: the phase cannot be recovered, so start the run to rewrite it`,
    };
  }
  const { phase, attempt, stopped } = run.value;
  const label = oneLine(phase ?? 'the phase');
  const stop = stopped ? oneLine(stopped) : '';
  const retry = Number.isInteger(attempt) ? ` (attempt ${attempt + 1})` : '';
  let next_action;
  const pending = journal.ok && journal.value.pending ? Object.keys(journal.value.pending).sort() : [];
  if (!journal.ok && journal.error === 'unparsable') next_action = `Repair unparsable .rig/journal.json before resuming ${label}`;
  else if (pending.length) next_action = `Reconcile interrupted side effect "${oneLine(pending[0])}" before resuming ${label}`;
  else if (stop) next_action = `Resolve "${stop}" then rerun ${label}${retry}`;
  else next_action = `Continue ${label}`;
  return { phase: phase ?? null, last_attempt: attempt ?? null, stop_reason: stopped ?? null, next_action, evidence };
}

function once(repo, key, effect) {
  if (typeof key !== 'string' || !key || ['__proto__', 'constructor', 'prototype'].includes(key)) throw new Error('invalid journal key');
  const lock = acquireLock(repo, 'run-journal');
  try {
    const journal = { done: {}, pending: {}, ...loadOrEmpty(journalFile(repo), {}) };
    if (Object.hasOwn(journal.done, key)) return journal.done[key].result;
    if (Object.hasOwn(journal.pending, key)) throw new Error(`uncertain side effect ${key}: reconcile its receipt before retrying`);
    journal.pending[key] = { at: new Date().toISOString() };
    writeJson(journalFile(repo), journal);
    const result = effect();
    if (result && typeof result.then === 'function') throw new Error('journal.once requires a synchronous effect; reconcile asynchronous execution separately');
    journal.done[key] = { result, at: new Date().toISOString() };
    delete journal.pending[key];
    writeJson(journalFile(repo), journal);
    return result;
  } finally { fs.rmSync(lock, { force: true }); }
}

function complete(repo, { phase, required = ['full-gate'] }) {
  if (typeof phase !== 'string' || !phase || !Array.isArray(required) || !required.length || required.some((name) => !/^[a-z0-9-]+$/.test(name))) return { completed: false, gap: 'phase and named required evidence are mandatory' };
  const dir = rigPath(repo, 'evidence');
  const names = fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.json')).sort() : [];
  if (names.length === 0) return { completed: false, gap: `no evidence records for ${phase}` };
  for (const name of required) if (!names.includes(`${name}.json`)) return { completed: false, gap: `missing required evidence: ${name}` };
  const digest = sourceDigest(repo);
  for (const name of names) {
    try {
      const row = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
      if (!row || row.phase !== phase || row.status !== 'pass' || row.exit_code !== 0 || row.digest !== digest) return { completed: false, gap: `failed, stale or unrelated evidence record: ${path.basename(name, '.json')}` };
    } catch {
      return { completed: false, gap: `corrupt evidence record: ${path.basename(name, '.json')}` };
    }
  }
  writeJson(rigPath(repo, 'complete'), { phase, at: new Date().toISOString() });
  return { completed: true };
}

function runShell(repo, command) {
  const r = spawnSync(command, { cwd: repo, shell: true, encoding: 'utf8' });
  if (r.error) throw r.error;
  return { status: r.status, output: `${r.stdout ?? ''}${r.stderr ?? ''}` };
}

function trackedFiles(repo) {
  const r = spawnSync('git', ['ls-files', '-co', '--exclude-standard', '-z'], { cwd: repo, encoding: 'utf8' });
  if (r.status !== 0) throw new Error(`git ls-files failed in ${repo}: ${r.stderr}`);
  return r.stdout.split('\0').filter((p) => p && !p.startsWith(`${RIG}/`)).sort();
}

function candidateDigest(repo) {
  return sourceDigest(repo);
}

function recordRed(repo, { package: pkg, command }) {
  tddFile(repo, pkg);
  const run = runShell(repo, command);
  if (run.status === 0) throw new Error('red command passed: not a genuine failure');
  const red = { command, exit_code: run.status, output: run.output, recorded_at: new Date().toISOString() };
  const rec = loadOrEmpty(tddFile(repo, pkg), {});
  rec.red = red;
  writeJson(tddFile(repo, pkg), rec);
  return red;
}

function recordGreen(repo, { package: pkg, command, gate }) {
  tddFile(repo, pkg);
  if (command === FULL_GATE) throw new Error('full gate is a reserved evidence label, not a focused command');
  if (gate) {
    let canonical = null;
    const manifestFile = containedPath(repo, '.rig/contract/manifest.json');
    if (fs.existsSync(manifestFile)) {
      require('./preflight').verifyInputs(repo, 'oracle_signed');
      canonical = JSON.parse(fs.readFileSync(manifestFile, 'utf8')).full_gate?.command;
    } else {
      const pkgFile = containedPath(repo, 'package.json');
      const metadata = fs.existsSync(pkgFile) ? JSON.parse(fs.readFileSync(pkgFile, 'utf8')) : null;
      if (typeof metadata?.scripts?.test === 'string' && metadata.scripts.test.trim()) canonical = 'npm test';
    }
    if (!canonical || gate !== canonical) throw new Error('full gate must use the repository npm test command or the exact owner-signed gate definition');
  }
  const before = candidateDigest(repo);
  const run = runShell(repo, command);
  if (run.status !== 0) throw new Error(`green command failed (exit ${run.status}): ${command}`);
  if (candidateDigest(repo) !== before) throw new Error('candidate changed during focused check; rerun on unchanged bytes');
  if (gate) {
    const gateRun = runShell(repo, gate);
    if (gateRun.status !== 0) throw new Error(`${FULL_GATE} failed (exit ${gateRun.status}): ${gate}`);
    if (candidateDigest(repo) !== before) throw new Error('candidate changed during full gate; rerun on unchanged bytes');
  }
  const rec = loadOrEmpty(tddFile(repo, pkg), {});
  const digest = candidateDigest(repo);
  let at = Date.now();
  if (rec.red) at = Math.max(at, Date.parse(rec.red.recorded_at) + 1);
  const green = { command, exit_code: 0, output: run.output, recorded_at: new Date(at).toISOString() };
  rec.green = green;
  if (gate) rec.full_gate_command = gate;
  rec.candidate_digest = digest;
  rec.checks = { ...rec.checks, [command]: digest };
  if (gate) rec.checks[FULL_GATE] = digest;
  rec.required = [...new Set([command, FULL_GATE])];
  writeJson(tddFile(repo, pkg), rec);
  return green;
}

function evidence(repo, pkg) {
  if (!fs.existsSync(tddFile(repo, pkg))) return null;
  const rec = loadOrEmpty(tddFile(repo, pkg), {});
  return { red: rec.red, green: rec.green, candidate_digest: rec.candidate_digest, checks: rec.checks, required: rec.required, full_gate_command: rec.full_gate_command };
}

function verify(repo, pkg) {
  const rec = evidence(repo, pkg);
  if (!rec || !rec.green) return { current: false, must_rerun: [`no green record for ${pkg}`] };
  const digest = candidateDigest(repo);
  const checks = rec.checks ?? {};
  const must_rerun = Array.isArray(rec.required) ? rec.required.filter((name) => checks[name] !== digest) : [FULL_GATE];
  if (!rec.full_gate_command && !must_rerun.includes(FULL_GATE)) must_rerun.push(FULL_GATE);
  return { current: must_rerun.length === 0, must_rerun };
}

function requiresSeam(repo, rel, seamAbs) {
  const abs = path.join(repo, rel);
  const src = fs.readFileSync(abs, 'utf8');
  for (const [, spec] of src.matchAll(/require\(\s*['"](\.{1,2}\/[^'"]+)['"]\s*\)/g)) {
    const base = path.resolve(path.dirname(abs), spec);
    if ([base, `${base}.js`].includes(seamAbs)) return true;
  }
  return false;
}

// Symptom vocabulary: position + character class + polarity. Anything else is a handoff, never a guess.
// shortcut: three classes and CommonJS seams only, add a class row (and an ESM loader) when a symptom needs one.
const INVISIBLE = ['​', '‌', '‍', '⁠', '﻿'];
const CLASSES = {
  whitespace: { re: '[\\s\\u200B\\u200C\\u200D\\u2060\\uFEFF]', chars: [' ', '\t', '\n', '\r', ' ', ...INVISIBLE] },
  separator: { re: '[-_./,;:|]', chars: ['-', '_', '.', '/', ',', ';', ':', '|'] },
  case: { re: '\\p{Lu}', chars: ['A', 'Z', 'É'], lower: true },
};
const POSITIONS = ['leading', 'trailing'];
const POLARITY = /^(survive|remain|leak)s?$/;

function parseSymptom(symptom) {
  const text = String(symptom);
  // A symptom is a phrase, not a payload. Control characters have no place in
  // one and are the only way free text could reach generated source.
  if (/[\u0000-\u001f\u007f\u2028\u2029]/.test(text)) {
    return { handoff: 'symptom contains a control character and was not parsed' };
  }
  const words = text.toLowerCase().match(/[a-z]+/g) ?? [];
  const position = words.find((w) => POSITIONS.includes(w));
  const cls = words.find((w) => Object.hasOwn(CLASSES, w));
  if (!position || !cls || !words.some((w) => POLARITY.test(w))) {
    return { handoff: `symptom "${symptom}" does not parse as <leading|trailing> <${Object.keys(CLASSES).join('|')}> <survives|remains|leaks>` };
  }
  const { re, chars, lower } = CLASSES[cls];
  const run = `(?:${re})+`;
  return {
    position,
    cls,
    // invariant: the seam output must not begin (or end) with the class
    violates: new RegExp(position === 'leading' ? `^${run}` : `${run}$`, 'u'),
    // probes: every class character beside an ordinary letter, doubled, and a clean control
    inputs: ['x', 'a b', ...chars.flatMap((c) => (position === 'leading' ? [`${c}x`, `${c}${c}x`] : [`x${c}`, `x${c}${c}`]))],
    strip: `new RegExp(${JSON.stringify(position === 'leading' ? `^${run}` : `${run}$`)}, 'u')`,
    replacement: lower ? '(m) => m.toLowerCase()' : "''",
  };
}

// Child process: a fresh `node -e` always observes the module as it is on disk right now.
const PROBE_CHILD = `
const fs = require('node:fs');
const { file, inputs } = JSON.parse(fs.readFileSync(0, 'utf8'));
const mod = require(file);
const name = typeof mod === 'function' ? null : Object.keys(mod).find((k) => typeof mod[k] === 'function');
const fn = name === null ? mod : mod[name];
if (typeof fn !== 'function') { console.error('seam exports no function'); process.exit(2); }
const results = inputs.map((i) => { try { return { out: fn(i) }; } catch (e) { return { error: String(e.message) }; } });
process.stdout.write(JSON.stringify({ name, results }));`;

const CALLER_CHILD = `
const fs = require('node:fs');
const { file, inputs } = JSON.parse(fs.readFileSync(0, 'utf8'));
let mod;
try { mod = require(file); } catch (e) { process.stdout.write(JSON.stringify({ loaded: false, error: String(e.message) })); process.exit(0); }
const fns = typeof mod === 'function' ? [['default', mod]] : Object.entries(mod).filter(([, v]) => typeof v === 'function');
let calls = 0; const failures = [];
for (const [k, fn] of fns) for (const i of inputs) {
  try { fn(i); calls += 1; } catch (e) { failures.push(k + '(' + JSON.stringify(i) + '): ' + e.message); }
}
process.stdout.write(JSON.stringify({ loaded: true, calls, failures }));`;

function inChild(repo, script, payload) {
  const r = spawnSync(process.execPath, ['-e', script], { cwd: repo, input: JSON.stringify(payload), encoding: 'utf8' });
  if (r.error || r.status !== 0) return { error: r.error?.message ?? (r.stderr.trim() || `exit ${r.status}`) };
  return JSON.parse(r.stdout);
}

// Probes the seam; `failing` lists the inputs whose output breaks the invariant.
function probe(repo, seamAbs, parsed) {
  const r = inChild(repo, PROBE_CHILD, { file: seamAbs, inputs: parsed.inputs });
  if (r.error) return { error: r.error };
  const failing = parsed.inputs.filter((_, n) => typeof r.results[n].out !== 'string' || parsed.violates.test(r.results[n].out));
  return { name: r.name, failing };
}

// One repair, appended to the seam: wrap the probed export and strip the offending run from its result.
function repairSource(parsed, name) {
  // Only the enumerated parse goes into generated source. The raw symptom is
  // caller-supplied free text and must never be interpolated into code.
  return `\n// rig root-cause repair: the shared seam strips the ${parsed.position} ${parsed.cls} run itself.
(() => {
  const strip = (s) => (typeof s === 'string' ? s.replace(${parsed.strip}, ${parsed.replacement}) : s);
  const wrap = (fn) => function (...args) { return strip(fn.apply(this, args)); };
  ${name === null ? 'module.exports = Object.assign(wrap(module.exports), module.exports);' : `module.exports[${JSON.stringify(name)}] = wrap(module.exports[${JSON.stringify(name)}]);`}
})();\n`;
}

function rootCause(repo, { symptom, seam }) {
  const parsed = parseSymptom(symptom);
  if (parsed.handoff) return { reproduced: false, handoff: parsed.handoff };
  const seamAbs = containedPath(repo, seam);
  const seamRel = toPosix(path.relative(repo, seamAbs));
  const callers = trackedFiles(repo)
    .filter((rel) => rel.endsWith('.js') && rel !== seamRel && requiresSeam(repo, rel, seamAbs))
    .sort();
  const before = probe(repo, seamAbs, parsed);
  if (before.error) return { reproduced: false, handoff: `seam could not be probed: ${before.error}`, callers };
  const symptom_reproduced_before_fix = before.failing.length > 0;
  const report = { symptom, seam: seamRel, callers, fixed_in: [], symptom_reproduced_before_fix, probes: parsed.inputs.length, failing_before: before.failing, caller_checks: {} };
  if (!symptom_reproduced_before_fix) return { ...report, handoff: 'symptom did not reproduce on any probe input, so nothing was changed' };

  const original = fs.readFileSync(seamAbs, 'utf8');
  writeAtomic(seamAbs, original + repairSource(parsed, before.name));
  const after = probe(repo, seamAbs, parsed);
  if (after.error || after.failing.length > 0) {
    writeAtomic(seamAbs, original);
    return { ...report, handoff: `repair did not satisfy the invariant (${after.error ?? `${after.failing.length} probes still fail`}); seam restored` };
  }
  report.fixed_in.push(seamRel);
  report.failing_after = after.failing;
  for (const rel of callers) {
    const r = inChild(repo, CALLER_CHILD, { file: path.join(repo, rel), inputs: parsed.inputs });
    report.caller_checks[rel] = r.error ? { passed: false, error: r.error } : { passed: r.loaded && r.failures.length === 0, ...r };
  }
  return report;
}

module.exports = { read, once, complete, recordRed, recordGreen, evidence, verify, rootCause };
