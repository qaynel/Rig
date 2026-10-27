'use strict';

// Bounded improvement (WP09). A mistake seen twice yields exactly one cited
// candidate; it is replayed against historical positive and negative cases and
// promoted only with proof and an unchanged passing full gate. Failed trials
// persist and silence repeats. Protected surfaces have no write path here:
// a change to them is left as a proposal for the owner's Gate 1 key.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('node:os');
const { containedPath } = require('../../lib/path-safety');
const { detectSandboxSync, runSandboxed } = require('../../lib/sandbox');
const { sourceDigest, sourceSnapshot, sourceFileCovered } = require('./release-evidence');
const journal = require('./run-journal');

const OUTCOMES = ['helped', 'hurt', 'no observed effect', 'confounded'];
const PROTECTED = new Set([
  'oracle', 'policy', 'trust', 'security', 'evaluator', 'release-authority',
  'gate1', 'acceptance', 'release-checks', 'skills', 'routing', 'model-policy',
]);
const LOCAL = new Set(['memory', 'check', 'fixture']);
// Dropped before comparing two instructions; negations ("never") are kept.
const FILLER = new Set(['always', 'first', 'then', 'the', 'a', 'an', 'before', 'after', 'and', 'to', 'please', 'also', 'just']);

const dir = (repo) => path.join(repo, '.rig', 'learning');
const hash = (s) => crypto.createHash('sha256').update(s).digest('hex').slice(0, 8);

function load(file, fallback) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

function save(repo, rel, value) {
  const file = containedPath(repo, `.rig/learning/${rel}`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
  return path.relative(repo, file).split(path.sep).join('/');
}

const history = (repo) => load(path.join(repo, '.rig', 'history.json'), { findings: [], instructions: [], cases: [] });

function group(items, keyOf) {
  const groups = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups.entries()];
}

const phrase = (text) => [...new Set((String(text).toLowerCase().match(/[a-z0-9]+/g) || []).filter((w) => !FILLER.has(w)))].sort().join(' ');

// Second occurrence only: a lone event is noise. Exact/near-exact matching,
// so the ceiling is false negatives, never a false candidate.
function candidates(repo) {
  const h = history(repo);
  const out = [];
  for (const [cls, items] of group(h.findings || [], (f) => f.class)) {
    if (typeof cls !== 'string' || !/^[A-Za-z0-9_-]+$/.test(cls)) throw new Error('history finding class must be a safe identifier');
    const sources = [...new Set(items.map((f) => f.id))];
    if (sources.length < 2) continue;
    out.push({ id: `cand-${cls}`, kind: 'check', class: cls, sources, scope: [...new Set(items.map((f) => f.where))], auto_promote: false });
  }
  for (const [key, items] of group(h.instructions || [], (i) => phrase(i.text))) {
    const sources = [...new Set(items.map((i) => i.id))];
    if (sources.length < 2) continue;
    // A repeated instruction is only ever considered; it never self-promotes.
    out.push({ id: `cand-instruction-${hash(key)}`, kind: 'instruction', sources, scope: 'repository', auto_promote: false, text: items[items.length - 1].text });
  }
  save(repo, 'candidates.json', out);
  return out;
}

function find(repo, id) {
  const found = candidates(repo).find((c) => c.id === id);
  if (!found) throw new Error(`unknown candidate: ${id}`);
  return found;
}

function evaluate(repo, id, { before, check } = {}) {
  const candidate = find(repo, id);
  const h = history(repo);
  const where = (h.findings || []).filter((f) => candidate.sources.includes(f.id)).map((f) => f.where);
  const replay = {};
  for (const c of h.cases || []) replay[c.id] = { caught: null, before: null, expected: c.fails_before === true };
  const candidate_snapshot = sourceSnapshot(repo);
  const candidate_digest = candidate_snapshot.digest;
  let failure = null;
  let evidence_kind = 'gap';
  if (before && check && (h.cases || []).every((c) => Object.hasOwn(c, 'input') && typeof c.fails_before === 'boolean')) {
    const beforeFile = containedPath(repo, before);
    const checkFile = containedPath(repo, check);
    if (!sourceFileCovered(repo, before) || !sourceFileCovered(repo, check)) {
      failure = 'replay scripts must be regular files covered by the candidate digest';
    } else {
      const sandbox = detectSandboxSync();
      if (!sandbox.available) failure = `replay sandbox unavailable (${sandbox.code}): ${sandbox.reason}`;
      else {
        const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-learning-replay-'));
        const scratch = path.join(work, 'scratch');
        const fixtures = path.join(work, 'fixtures');
        fs.mkdirSync(scratch);
        fs.mkdirSync(fixtures);
        try {
          const script = path.join(scratch, 'replay.js');
          const beforeCopy = path.join(fixtures, 'before.js');
          const checkCopy = path.join(fixtures, 'check.js');
          const beforeBytes = fs.readFileSync(beforeFile);
          const checkBytes = fs.readFileSync(checkFile);
          const expected = (file, bytes) => {
            const rel = path.relative(fs.realpathSync(repo), file).split(path.sep).join('/');
            const mode = candidate_snapshot.modes[rel];
            return mode === undefined ? null : crypto.createHash('sha256')
              .update(Buffer.concat([Buffer.from(`file\0${mode}\0`), bytes])).digest('hex');
          };
          if (expected(beforeFile, beforeBytes) !== candidate_snapshot.files[path.relative(fs.realpathSync(repo), beforeFile).split(path.sep).join('/')]
            || expected(checkFile, checkBytes) !== candidate_snapshot.files[path.relative(fs.realpathSync(repo), checkFile).split(path.sep).join('/')]) {
            failure = 'replay fixture bytes changed after candidate snapshot';
          } else {
            fs.writeFileSync(beforeCopy, beforeBytes);
            fs.writeFileSync(checkCopy, checkBytes);
          }
          if (!failure && sourceDigest(repo) !== candidate_digest) throw new Error('candidate bytes changed while copying replay fixtures');
          if (!failure) {
            const source = `const fs=require('node:fs'),vm=require('node:vm');
              const load=file=>{const module={exports:{}}; vm.runInNewContext(fs.readFileSync(file,'utf8'),
                {module,exports:module.exports}, {filename:file, timeout:1000,
                  contextCodeGeneration:{strings:false,wasm:false}});
                if(typeof module.exports!=='function') throw new Error('replay fixture must export a function');
                return module.exports;};
              const before=load(${JSON.stringify(beforeCopy)}), after=load(${JSON.stringify(checkCopy)});
              const rows=${JSON.stringify(h.cases)}.map(c=>({id:c.id,before:before(c.input),caught:after(c.input)}));
              process.stdout.write(JSON.stringify(rows));`;
            fs.writeFileSync(script, source);
            // Only copied, digest-checked fixtures are visible. The repo itself
            // is not mounted, so even a VM escape cannot read mutable evidence.
            const result = runSandboxed(sandbox.kind, { script, outDir: scratch, readDirs: [fixtures], timeoutMs: 5000 });
            failure = result.timedOut ? 'executable replay timed out'
              : result.status !== 0 ? (result.stderr.trim() || 'executable replay failed') : null;
            if (!failure) {
              try {
                const rows = JSON.parse(result.stdout);
                if (!Array.isArray(rows) || rows.length !== h.cases.length || rows.some((r) =>
                  !Object.hasOwn(replay, r.id) || typeof r.before !== 'boolean' || typeof r.caught !== 'boolean')) throw new Error('malformed replay output');
                for (const row of rows) Object.assign(replay[row.id], row);
              } catch (e) { failure = e.message; }
            }
          }
        } finally { fs.rmSync(work, { recursive: true, force: true }); }
      }
    }
    if (sourceDigest(repo) !== candidate_digest) failure = 'candidate bytes changed during replay';
    evidence_kind = failure ? 'gap' : 'executed';
  } else if ((h.cases || []).length > 0 && (h.cases || []).every((c) => typeof c.fails_before === 'boolean' && !Object.hasOwn(c, 'input'))) {
    failure = 'declared fails_before is not execution evidence';
    evidence_kind = 'synthetic-fixture';
  } else {
    failure = 'executable before/after checks and case inputs are required for replay';
    evidence_kind = 'gap';
  }
  const cases = Object.values(replay);
  const positives = cases.filter((r) => r.expected);
  const negatives = cases.filter((r) => !r.expected);
  let outcome = 'confounded';
  if (!failure && positives.length && negatives.length && positives.every((r) => r.before === false)
    && negatives.every((r) => r.before === false)) {
    if (negatives.some((r) => r.caught)) outcome = 'hurt';
    else outcome = positives.every((r) => r.caught) ? 'helped' : 'no observed effect';
  }
  const admits_learning = evidence_kind === 'executed' && outcome === 'helped';
  const evaluation = {
    candidate: id,
    candidate_digest,
    evidence_kind,
    admits_learning,
    ...(failure ? { gap: failure } : {}),
    mechanism: { before: before || null, check: check || null },
    before_fixture: { where, expect: 'defect present, uncaught' },
    after_fixture: { where, expect: 'defect caught by the proposed check' },
    replay,
    outcome,
  };
  save(repo, `evaluations/${id}.json`, evaluation);
  return evaluation;
}

function promote(repo, id, { full_gate, evaluation } = {}) {
  const candidate = find(repo, id);
  const no = (reason) => ({ promoted: false, reason });
  if (!full_gate || full_gate.passed !== true) {
    const failed = full_gate && full_gate.failures ? `: ${full_gate.failures.join(', ')}` : '';
    return no(`regression: the unchanged full gate did not pass${failed}`);
  }
  const proof = evaluation === undefined ? load(path.join(dir(repo), 'evaluations', `${id}.json`), null) : evaluation;
  if (!proof || proof.outcome !== 'helped') return no('missing proof: no passing positive/negative evaluation is attached');
  if (proof.evidence_kind !== 'executed' || proof.admits_learning !== true) return no('missing proof: evaluation has no executed red/green evidence');
  const recorded = load(path.join(dir(repo), 'evaluations', `${id}.json`), null);
  if (!recorded || JSON.stringify(recorded) !== JSON.stringify(proof)
    || proof.candidate !== id || proof.candidate_digest !== sourceDigest(repo)) return no('missing proof: evaluation is unrecorded or stale');
  const gate = journal.evidence(repo, id);
  if (!gate || !journal.verify(repo, id).current || gate.checks?.['full gate'] !== proof.candidate_digest) {
    return no('regression: record a passing full gate on the unchanged candidate before promotion');
  }
  if (candidate.kind !== 'check') return no('protected: instructions and skills are proposals for the owner, never auto-promoted');
  const file = save(repo, `checks/${id}.json`, {
    id, class: candidate.class, sources: candidate.sources, evidence: proof, full_gate,
    promoted_at: new Date().toISOString(), rollback: 'delete this file',
  });
  return { promoted: true, path: file };
}

function apply(repo, { target, change, owner_approved, signed_by } = {}) {
  if (PROTECTED.has(target)) {
    const proposal_path = save(repo, `proposals/${target}-${hash(String(change))}.json`, {
      target, change, status: 'awaiting-owner-key', requested_at: new Date().toISOString(),
    });
    // Authority is the owner's Gate 1 signature, verified elsewhere; a flag or an
    // agent-named signer is never one, so this module cannot apply protected bytes.
    const forged = owner_approved ? `; owner_approved by ${signed_by || 'caller'} is not a signature` : '';
    return { applied: false, reason: `protected target: only the owner key can authorise this change${forged}`, awaiting: 'owner-key', proposal_path };
  }
  if (!LOCAL.has(target)) return { applied: false, reason: `unknown target: ${target}` };
  const log = path.join(dir(repo), 'applied.json');
  save(repo, 'applied.json', [...load(log, []), { target, change, at: new Date().toISOString() }]);
  return { applied: true };
}

const trials = (repo) => load(path.join(dir(repo), 'trials.json'), []);

function record(repo, { candidate, outcome, reason }) {
  if (!OUTCOMES.includes(outcome)) throw new Error(`outcome must be one of: ${OUTCOMES.join(', ')}`);
  const entry = { candidate, outcome, reason: reason || '', at: new Date().toISOString() };
  save(repo, 'trials.json', [...trials(repo), entry]);
  return entry;
}

// Abstain on a prior failed trial; new evidence writes a reopen marker so only
// trials after it count.
function propose(repo, id, { new_evidence } = {}) {
  find(repo, id);
  if (new_evidence) {
    save(repo, 'trials.json', [...trials(repo), { candidate: id, outcome: 'reopened', evidence: new_evidence, at: new Date().toISOString() }]);
    return { proposed: true, candidate: id, evidence: new_evidence };
  }
  const own = trials(repo).filter((t) => t.candidate === id);
  const reopened = own.map((t) => t.outcome).lastIndexOf('reopened');
  const prior = own.slice(reopened + 1).reverse().find((t) => t.outcome !== 'helped');
  if (prior) return { proposed: false, reason: `abstain: prior trial recorded "${prior.outcome}"; new evidence is required`, cites: prior };
  return { proposed: true, candidate: id };
}

module.exports = { candidates, evaluate, promote, apply, record, propose };
