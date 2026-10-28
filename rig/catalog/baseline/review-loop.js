'use strict';

// Independent review loop for one repository. A round either completes with a
// verdict (consuming one attempt) or fails as an infrastructure event (consuming
// nothing). Open findings carry forward across rounds, re-anchored to the current
// file bytes so line drift does not erase them. Review independence is enforced
// by procedural separation: the author context identifier cannot match the
// reviewer identifier. The default is one user in separate sessions, including
// the same model. A repository may require a different provider by writing
// `.rig/review/independence.json` as `{ "level": "provider" }`. State lives in
// <repo>/.rig/review/ledger.json.

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { sourceDigest } = require('./release-evidence');

function assertRepo(repo) {
  if (typeof repo !== 'string' || !fs.existsSync(repo) || !fs.statSync(repo).isDirectory()) {
    throw new Error(`review repository is not an existing directory: ${repo}`);
  }
}

const ledgerFile = (repo) => path.join(repo, '.rig', 'review', 'ledger.json');

function readLedger(repo) {
  const file = ledgerFile(repo);
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function loadLedger(repo) {
  return readLedger(repo) || {
    author: `author-${crypto.randomBytes(8).toString('hex')}`,
    attempts: 0,
    infra_failures: 0,
    rounds: [],
    findings: [],
    preparations: [],
    prepared: null,
  };
}

function saveLedger(repo, ledger) {
  fs.mkdirSync(path.dirname(ledgerFile(repo)), { recursive: true });
  fs.writeFileSync(ledgerFile(repo), `${JSON.stringify(ledger, null, 2)}\n`);
}

// Resolve a repo-relative path, or null when it would leave the repository.
function inside(repo, rel) {
  if (typeof rel !== 'string' || rel === '') return null;
  const abs = path.resolve(repo, rel);
  const back = path.relative(repo, abs);
  if (back === '' || path.isAbsolute(back) || back.split(path.sep)[0] === '..') return null;
  return abs;
}

function isFile(abs) {
  try {
    return abs !== null && fs.statSync(abs).isFile();
  } catch {
    return false;
  }
}

function linesOf(repo, rel) {
  const abs = inside(repo, rel);
  try {
    return abs && fs.statSync(abs).isFile() ? fs.readFileSync(abs, 'utf8').split('\n') : null;
  } catch {
    return null;
  }
}

// Unicode-aware so non-Latin problem text does not collapse to one shared class.
const squash = (s) => String(s ?? '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
const classOf = (file, problem) => `${file}::${squash(problem)}`;

function anchorAt(repo, file, line) {
  const lines = linesOf(repo, file);
  return lines && Number.isInteger(line) && line >= 1 && line <= lines.length ? lines[line - 1].trim() : '';
}

function normalize(repo, f) {
  return {
    file: f.file,
    line: f.line,
    problem: f.problem,
    class: classOf(f.file, f.problem),
    anchor: anchorAt(repo, f.file, f.line),
  };
}

function validateDispositionEvidence(repo, item) {
  const evidence = item.evidence;
  if (!evidence || typeof evidence !== 'object' || typeof evidence.path !== 'string'
    || !/^[a-f0-9]{64}$/.test(evidence.digest || '')
    || !evidence.check || typeof evidence.check.command !== 'string'
    || !evidence.check.command.trim()
    || evidence.check.result !== (item.status === 'resolved' ? 'pass' : 'fail')) {
    throw new Error('disposition evidence needs a repository path, SHA-256, and matching check command/result');
  }
  const abs = inside(repo, evidence.path);
  if (!isFile(abs)) throw new Error(`disposition evidence file is missing or outside the repository: ${evidence.path}`);
  const rootPath = fs.realpathSync(repo);
  const filePath = fs.realpathSync(abs);
  const rel = path.relative(rootPath, filePath);
  if (!rel || rel === '..' || rel.startsWith(`..${path.sep}`) || path.isAbsolute(rel)) {
    throw new Error(`disposition evidence file escapes the repository: ${evidence.path}`);
  }
  const actual = crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
  if (actual !== evidence.digest) throw new Error(`disposition evidence digest is stale: ${evidence.path}`);
}

function infraMessage(error, verdict) {
  if (error) {
    return /timeout/i.test(String(error)) ? `review timeout: ${error}` : `review provider outage: ${error}`;
  }
  return `review output malformed: verdict ${JSON.stringify(verdict ?? null)} is not 'pass' or 'fail'`;
}

function openOf(ledger) {
  return ledger.findings.filter((f) => f.status === 'open').map((f) => ({ ...f }));
}

function independencePolicy(repo) {
  const file = path.join(repo, '.rig', 'review', 'independence.json');
  if (!fs.existsSync(file)) return { level: 'session', same_model: true };
  let parsed;
  try { parsed = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {
    throw new Error('review independence policy is not valid JSON');
  }
  if (!parsed || (parsed.level !== 'session' && parsed.level !== 'provider')) {
    throw new Error('review independence level must be session or provider');
  }
  return { level: parsed.level, same_model: parsed.level === 'session' };
}

function record(repo, { round, verdict, findings = [], dispositions = [], reviewer, reviewer_provider, author_provider, error } = {}) {
  assertRepo(repo);
  const ledger = loadLedger(repo);

  if (error || (verdict !== 'pass' && verdict !== 'fail')) {
    ledger.infra_failures += 1;
    saveLedger(repo, ledger);
    throw new Error(infraMessage(error, verdict));
  }
  if (reviewer && reviewer === ledger.author) {
    throw new Error('review must be independent: procedural separation requires author and reviewer identifiers differ (self-review refused)');
  }
  if (openOf(ledger).length && (!ledger.prepared || ledger.prepared.round !== round)) {
    throw new Error('remediation review requires a prepared candidate and frozen prior finding batch');
  }
  const candidateDigest = sourceDigest(repo);
  if (ledger.prepared && ledger.prepared.round === round && ledger.prepared.candidate_digest !== candidateDigest) {
    throw new Error('candidate changed after review preflight; prepare the new frozen candidate');
  }
  const independence = independencePolicy(repo);
  if (independence.level === 'provider' && (typeof reviewer_provider !== 'string' || !reviewer_provider.trim()
    || typeof author_provider !== 'string' || !author_provider.trim() || reviewer_provider === author_provider)) {
    throw new Error('review independence requires a different provider from the author session');
  }
  if (!Array.isArray(findings) || !Array.isArray(dispositions)) {
    throw new Error('review findings and dispositions must be arrays');
  }
  if (verdict === 'pass' && (typeof reviewer !== 'string' || !reviewer.trim() || findings.length)) {
    throw new Error('completed passing review requires an independent reviewer and no open findings');
  }

  const list = findings;
  const open = ledger.findings.filter((f) => f.status === 'open');
  const dispositionByClass = new Map();
  for (const item of dispositions) {
    if (!item || !['resolved', 'open'].includes(item.status)) throw new Error('each finding disposition needs a class and resolved/open status');
    validateDispositionEvidence(repo, item);
    if (dispositionByClass.has(item.class)) throw new Error(`duplicate disposition for ${item.class}`);
    dispositionByClass.set(item.class, item);
  }
  if (dispositionByClass.size !== open.length || open.some((f) => !dispositionByClass.has(f.class))) {
    throw new Error('review must disposition every carried finding from the prior batch');
  }
  const incoming = new Map(list.map((f) => {
    const n = normalize(repo, f);
    return [n.class, n];
  }));
  for (const finding of open) {
    const disposition = dispositionByClass.get(finding.class);
    if (disposition.status === 'resolved' && incoming.has(finding.class)) {
      throw new Error(`resolved finding ${finding.class} cannot remain in the current findings batch`);
    }
    if (disposition.status === 'open' && !incoming.has(finding.class)) {
      throw new Error(`open finding ${finding.class} must remain in the current report with its id/class`);
    }
    if (verdict === 'pass' && disposition.status !== 'resolved') {
      throw new Error(`passing review cannot leave finding ${finding.class} open`);
    }
  }
  if (verdict === 'pass' && open.some((f) => dispositionByClass.get(f.class).status !== 'resolved')) {
    throw new Error('passing review cannot leave mandatory findings unresolved');
  }
  ledger.attempts += 1;
  ledger.rounds.push({
    round,
    verdict,
    reviewer: reviewer ?? null,
    findings_count: list.length,
    recorded_at: new Date().toISOString(),
    candidate_digest: candidateDigest,
    finding_batch: [...incoming.values()],
    dispositions: dispositions.map((item) => ({ ...item })),
  });

  if (verdict === 'fail') {
    // One bump per class per round, even when the reviewer repeats a finding.
    const batch = new Map();
    for (const f of list) {
      const n = normalize(repo, f);
      batch.set(n.class, n);
    }
    for (const f of batch.values()) {
      const known = ledger.findings.find((x) => x.class === f.class);
      if (known) {
        const disposition = dispositionByClass.get(f.class);
        if (disposition && disposition.status === 'resolved') {
          known.status = 'resolved';
        } else {
          Object.assign(known, { line: f.line, anchor: f.anchor, status: 'open', seen_in_rounds: known.seen_in_rounds + 1 });
        }
      } else {
        ledger.findings.push({ ...f, status: 'open', seen_in_rounds: 1 });
      }
    }
    for (const finding of open) {
      const disposition = dispositionByClass.get(finding.class);
      if (disposition.status === 'resolved') finding.status = 'resolved';
    }
  } else {
    for (const f of open) f.status = 'resolved';
  }

  if (ledger.prepared?.round === round) ledger.prepared = null;
  saveLedger(repo, ledger);
  return { round, verdict, attempts: ledger.attempts, unresolved: openOf(ledger) };
}

// Follow the stored anchor text to where it now sits; keep the old line and flag it when the text is gone.
function reanchor(repo, finding) {
  const copy = { ...finding, anchor_lost: false };
  const lines = finding.anchor ? linesOf(repo, finding.file) : null;
  const hits = lines ? lines.map((_, i) => i + 1).filter((n) => lines[n - 1].trim() === finding.anchor) : [];
  if (!hits.length) {
    copy.anchor_lost = true;
    return copy;
  }
  copy.line = hits.reduce((best, n) => (Math.abs(n - finding.line) < Math.abs(best - finding.line) ? n : best));
  finding.line = copy.line; // persisted by prepare so the next round starts from here
  return copy;
}

// shortcut: each file is diffed whole as a new file against /dev/null, so reviewers see the full current file rather than the delta since the last round; upgrade when rounds must show only what changed
function gitNewFileDiff(repo, rel) {
  const res = spawnSync('git', ['diff', '--no-index', '--no-color', '--', '/dev/null', rel], { cwd: repo, encoding: 'utf8' });
  if (res.error || (res.status !== 0 && res.status !== 1)) {
    throw new Error(`git diff failed for ${rel}: ${res.error ? res.error.message : res.stderr}`);
  }
  return res.stdout || `# empty file: ${rel}\n`;
}

// Existing repo files become a real diff; anything else is literal diff text, returned as given.
function diffText(repo, diff) {
  const rels = Array.isArray(diff) ? diff : [diff];
  if (rels.length && rels.every((rel) => isFile(inside(repo, rel)))) {
    return rels.map((rel) => gitNewFileDiff(repo, path.relative(repo, inside(repo, rel)).split(path.sep).join('/'))).join('');
  }
  return Array.isArray(diff) ? diff.join('\n') : diff;
}

function prepare(repo, { round, diff } = {}) {
  assertRepo(repo);
  const ledger = loadLedger(repo);
  const unresolved = ledger.findings.filter((f) => f.status === 'open').map((f) => reanchor(repo, f));
  saveLedger(repo, ledger);
  const lastFailed = [...ledger.rounds].reverse().find((entry) => entry.verdict === 'fail');
  const plan = {
    round, phase: unresolved.length ? 'remediation' : 'comprehensive', author: ledger.author,
    diff: diffText(repo, diff), unresolved, prior_batch: unresolved,
    candidate_digest: sourceDigest(repo),
    prior_review_digest: lastFailed?.candidate_digest || null,
    attempts: ledger.attempts,
    independence: independencePolicy(repo),
  };
  ledger.prepared = {
    round,
    phase: plan.phase,
    candidate_digest: plan.candidate_digest,
    prior_batch: unresolved,
    prepared_at: new Date().toISOString(),
  };
  ledger.preparations = [...(ledger.preparations || []), { ...ledger.prepared }];
  saveLedger(repo, ledger);
  return plan;
}

// Read-only: reports 0 for a repository with no ledger and creates no state.
function attempts(repo) {
  assertRepo(repo);
  const ledger = readLedger(repo);
  return ledger ? ledger.attempts : 0;
}

module.exports = { record, prepare, attempts, independencePolicy };
