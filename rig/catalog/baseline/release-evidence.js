'use strict';

// Release evidence for the AI-SDLC lane. Every receipt is bound to the exact
// source bytes it was recorded against, so one changed byte invalidates it.
// State lives in <repo>/.rig/release/ (append-only JSONL plus published
// artifacts). This file ships standalone into host repositories, so it uses
// node built-ins only and requires no sibling module.

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { verifyTrustRootApproval } = require('../../lib/trust-root');
const { containedPath } = require('../../lib/path-safety');

const COMMIT_PREFIX = 'sha256:';
const REQUIRED_PUBLIC = ['security', 'independent-review', 'scenario-coherence', 'health', 'clean-install'];
const UNHEALTHY_ACTION = 'rollback to the previous release or recover per the release policy';

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function requireRepo(repo) {
  if (typeof repo !== 'string' || !fs.existsSync(repo) || !fs.statSync(repo).isDirectory()) {
    throw new Error(`repo must be an existing directory: ${repo}`);
  }
  return repo;
}

function requireCommit(commit) {
  if (typeof commit !== 'string' || commit.length === 0) {
    throw new Error('commit must be a non-empty string');
  }
  return commit;
}

function stateDir(repo) {
  return containedPath(repo, '.rig/release');
}

// Root-level .git is VCS metadata and root-level .rig holds the evidence itself.
const SKIP_AT_ROOT = new Set(['.git', '.context', '.venv', 'node_modules']);
// rig: ordinary run/memory state is mutable; installed code, trust and oracle
// stay in the digest. Add new mutable stores explicitly rather than hiding .rig.
const MUTABLE_RIG = new Set(['memory', 'release', 'workers', 'learning', 'evidence', 'tdd', 'review', 'journeys', 'archive', 'knowledge', 'efficiency', 'discovery', 'signoff', 'journal.json', 'run.json', 'complete', 'spend.json', 'model-routing-log.jsonl', 'catalog-install.lock', 'catalog-install.lock.recovery', 'work-packages-audit.json']);

function listFiles(repo, dir = repo, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === repo && SKIP_AT_ROOT.has(entry.name)) continue;
    if (dir === path.join(repo, '.rig') && MUTABLE_RIG.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) listFiles(repo, abs, out);
    else if (entry.isFile() || entry.isSymbolicLink()) out.push(path.relative(repo, abs).split(path.sep).join('/'));
    else throw new Error(`unsupported source file type: ${abs}`);
  }
  return out.sort();
}

// shortcut: walks the whole tree on every call, no git index; use the git tree hash once candidates are real commits
function snapshot(repo) {
  const files = {};
  const outer = crypto.createHash('sha256');
  for (const rel of listFiles(repo)) {
    const abs = path.join(repo, rel);
    const stat = fs.lstatSync(abs);
    files[rel] = sha256(stat.isSymbolicLink()
      ? Buffer.from(`symlink\0${fs.readlinkSync(abs)}`)
      : Buffer.concat([Buffer.from(`file\0${stat.mode & 0o111}\0`), fs.readFileSync(abs)]));
    outer.update(`${rel}\0${files[rel]}\n`);
  }
  return { digest: COMMIT_PREFIX + outer.digest('hex'), files };
}

function sourceDigest(repo) {
  return snapshot(requireRepo(repo)).digest;
}

function rowsOf(repo, name) {
  const file = path.join(stateDir(repo), name);
  if (!fs.existsSync(file)) return [];
  // shortcut: whole file re-read and linear scan per call, index once evidence grows
  return fs.readFileSync(file, 'utf8').split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

// shortcut: no append lock; concurrent writers from two processes are not serialised
function appendRow(repo, name, row) {
  fs.mkdirSync(stateDir(repo), { recursive: true });
  fs.appendFileSync(path.join(stateDir(repo), name), `${JSON.stringify(row)}\n`);
  return row;
}

function latest(rows, kind, commit) {
  return rows.filter((r) => r.kind === kind && r.commit === commit).pop();
}

// Clean-install counts only when it was a real download; other kinds need just status pass.
function passing(rows, kind, commit) {
  const row = latest(rows, kind, commit);
  if (!row || row.status !== 'pass' || row.digest !== commit || (row.verdict && row.verdict !== 'pass')) return false;
  return kind !== 'clean-install' || row.source === 'real-download';
}

function authorizationMessage(repo, { commit, identity, nonce, expires_at } = {}) {
  requireRepo(repo);
  if (!/^sha256:[a-f0-9]{64}$/.test(commit || '')) throw new Error('authorization requires an exact candidate digest');
  if (typeof identity !== 'string' || !/^[A-Za-z0-9_.@-]+$/.test(identity)) throw new Error('authorization requires a principal');
  if (typeof nonce !== 'string' || !/^[a-f0-9]{32,128}$/.test(nonce)) throw new Error('authorization requires a fresh nonce');
  const expiry = Date.parse(expires_at);
  if (!Number.isFinite(expiry) || expiry <= Date.now() || expiry > Date.now() + 15 * 60 * 1000) throw new Error('authorization must expire within fifteen minutes');
  return JSON.stringify({ purpose: 'rig-release-v1', repo: fs.realpathSync(repo), commit, identity, nonce, expires_at }) + '\n';
}

function record(repo, entry) {
  requireRepo(repo);
  if (!entry || typeof entry.kind !== 'string' || entry.kind.length === 0) {
    throw new Error('record needs an entry with a non-empty kind');
  }
  if (entry.commit !== undefined) requireCommit(entry.commit);
  const snap = snapshot(repo);
  return appendRow(repo, 'evidence.jsonl', {
    kind: entry.kind,
    status: entry.status ?? 'pass',
    commit: entry.commit ?? snap.digest,
    source: entry.source,
    verdict: entry.verdict,
    recorded_at: new Date().toISOString(),
    digest: snap.digest,
    files: snap.files,
  });
}

function get(map, key) {
  return Object.hasOwn(map, key) ? map[key] : null;
}

function check(repo, receipt) {
  requireRepo(repo);
  if (!receipt || typeof receipt.digest !== 'string') throw new Error('check needs a receipt with a digest');
  const now = snapshot(repo);
  if (now.digest === receipt.digest) return { valid: true, reason: '' };
  const before = receipt.files || {};
  const all = new Set([...Object.keys(before), ...Object.keys(now.files)]);
  const touched = [...all].filter((f) => get(before, f) !== get(now.files, f)).sort();
  const list = touched.length ? `: ${touched.join(', ')}` : '';
  return { valid: false, reason: `source bytes changed since receipt${list} (digest mismatch)` };
}

function eligible(repo, { commit } = {}) {
  requireRepo(repo);
  requireCommit(commit);
  const rows = rowsOf(repo, 'evidence.jsonl');
  const qa = passing(rows, 'qa-commit', commit);
  if (!qa || commit !== sourceDigest(repo)) {
    return { eligible: false, reason: `qa commit missing or stale for ${commit}: no qa-commit evidence, or source bytes changed since it was recorded` };
  }
  if (!passing(rows, 'health', commit)) {
    return { eligible: false, reason: `health evidence missing, stale or failing for ${commit}` };
  }
  if (!passing(rows, 'clean-install', commit)) {
    return { eligible: false, reason: `install evidence missing, stale or not a real download for ${commit}` };
  }
  return { eligible: true, reason: '' };
}

function refused(reason) {
  return { published: false, reason, cryptographic_signature: false };
}

function publish(repo, { commit, authorization } = {}) {
  requireRepo(repo);
  requireCommit(commit);
  const hasMaterial = authorization && (authorization.signed_by || typeof authorization.signature === 'string'
    || authorization.acknowledgement || authorization.receipt);
  if (!hasMaterial) return refused('protected action requires owner authorization; a readiness report is not authorization');
  if (!/^sha256:[a-f0-9]{64}$/.test(commit)) return refused('authorization requires an exact candidate digest');

  // Lazy require: user-signoff verifies release signatures through this module.
  const signoff = require('./user-signoff');
  const policy = signoff.current(repo);
  let assurance;
  if (policy) {
    const decision = signoff.authorizeRelease(repo, { commit, authorization });
    if (!decision.ok) return refused(decision.reason);
    const readiness = publicReadiness(repo, { commit });
    if (!readiness.ready) return refused(readiness.reason);
    assurance = decision.assurance;
  } else {
    const trustRootPath = path.join(repo, '.rig', 'trust', 'gate1.allowed-signers');
    if (fs.existsSync(trustRootPath)) {
      if (typeof authorization.signature !== 'string') {
        return refused('protected action requires owner authorization; a readiness report is not authorization');
      }
      try {
        verifyTrustRootApproval(repo, {
          identity: authorization.identity,
          namespace: 'rig-release',
          message: authorizationMessage(repo, { ...authorization, commit }),
          signature: authorization.signature,
        });
      } catch {
        // Never echo identities, signatures, key paths or caller-supplied secrets.
        return refused('owner authorization did not verify against the single Gate 1 trust root');
      }
      const readiness = publicReadiness(repo, { commit });
      if (!readiness.ready) return refused(readiness.reason);
      assurance = signoff.signatureAssurance(repo, 'unspecified');
    } else {
      return refused('protected action requires owner authorization; a readiness report is not authorization');
    }
  }

  const verdict = eligible(repo, { commit });
  if (!verdict.eligible) return refused(verdict.reason);

  const artifact = path.posix.join('.rig', 'release', 'published', `${commit.slice(COMMIT_PREFIX.length)}.json`);
  const abs = containedPath(repo, artifact);
  if (fs.existsSync(abs)) return refused(`commit already published: ${artifact}`);

  const now = new Date().toISOString();
  const final = snapshot(repo);
  if (final.digest !== commit) return refused('candidate changed during authorization; rerun evidence and approval');
  const bytes = Buffer.from(`${JSON.stringify({ commit, files: final.files, authorized: true, published_at: now, assurance }, null, 2)}\n`);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, bytes, { flag: 'wx' });
  const artifact_digest = COMMIT_PREFIX + sha256(bytes);
  appendRow(repo, 'evidence.jsonl', { kind: 'publish', status: 'pass', commit, artifact, artifact_digest, recorded_at: now });
  return { published: true, commit, artifact, artifact_digest, assurance, cryptographic_signature: assurance.cryptographic_signature === true };
}

function publicReadiness(repo, { commit } = {}) {
  requireRepo(repo);
  requireCommit(commit);
  if (commit !== sourceDigest(repo)) {
    return { ready: false, reason: `stale candidate: source bytes changed since ${commit}`, missing: [...REQUIRED_PUBLIC] };
  }
  const rows = rowsOf(repo, 'evidence.jsonl');
  const missing = REQUIRED_PUBLIC.filter((kind) => !passing(rows, kind, commit));
  if (missing.length === 0) return { ready: true, reason: '', missing: [] };
  return { ready: false, reason: `missing or failing evidence: ${missing.join(', ')}`, missing };
}

function unhealthyReason(health, publish, artifactDigest) {
  if (health !== 'pass') return `health check reported ${health}`;
  if (!publish) return 'no publish record for artifact';
  if (artifactDigest === null) return 'artifact file is missing';
  return 'artifact bytes changed since publish';
}

function validatePublished(repo, { artifact, health } = {}) {
  requireRepo(repo);
  if (typeof artifact !== 'string' || artifact.length === 0) throw new Error('validatePublished needs an artifact path');
  const root = fs.realpathSync(path.resolve(repo));
  const abs = containedPath(root, artifact);
  if (!abs.startsWith(path.join(root, '.rig', 'release', 'published') + path.sep)) {
    throw new Error(`artifact must live under .rig/release/published: ${artifact}`);
  }
  const publish = rowsOf(repo, 'evidence.jsonl').filter((r) => r.kind === 'publish' && r.artifact === artifact).pop();
  const bytes = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
  const artifact_digest = bytes ? COMMIT_PREFIX + sha256(bytes) : null;
  const healthy = health === 'pass' && Boolean(publish) && artifact_digest !== null && artifact_digest === publish.artifact_digest;
  const recorded_at = new Date().toISOString();
  const action = healthy ? 'none' : UNHEALTHY_ACTION;
  if (!healthy) {
    appendRow(repo, 'incidents.jsonl', {
      artifact,
      artifact_digest,
      reason: unhealthyReason(health, publish, artifact_digest),
      action,
      recorded_at,
    });
  }
  return { healthy, artifact, artifact_digest, recorded_at, action };
}

function incidents(repo) {
  requireRepo(repo);
  return rowsOf(repo, 'incidents.jsonl');
}

module.exports = { record, check, eligible, publish, publicReadiness, validatePublished, incidents, sourceDigest, authorizationMessage };
