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
const RELEASE_WORKFLOW_PATH = '.github/workflows/release-eligibility.yml';
const UNHEALTHY_ACTION = 'rollback to the previous release or recover per the release policy';
const externalProofs = new WeakSet();

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
const SKIP_AT_ROOT = new Set(['.git', '.context', '.credentials', '.DS_Store', '.venv', 'node_modules']);
// rig: ordinary run/memory state is mutable; installed code, trust, oracle and
// published worker briefs stay in the digest. Worker leases/status stay mutable.
const MUTABLE_RIG = new Set(['memory', 'release', 'learning', 'evidence', 'tdd', 'review', 'journeys', 'archive', 'knowledge', 'efficiency', 'discovery', 'signoff', 'journal.json', 'run.json', 'complete', 'spend.json', 'model-routing-log.jsonl', 'catalog-install.lock', 'catalog-install.lock.recovery', 'work-packages-audit.json']);

function listFiles(repo, dir = repo, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (dir === repo && (SKIP_AT_ROOT.has(entry.name)
      || (entry.name.startsWith('.env.') && entry.name !== '.env.example') || entry.name === '.env')) continue;
    if (dir === repo && entry.name === 'wiki') {
      const gate1 = path.join(repo, 'wiki', 'gate1');
      if (fs.existsSync(gate1)) listFiles(repo, gate1, out);
      continue;
    }
    if (dir === path.join(repo, '.rig') && MUTABLE_RIG.has(entry.name)) continue;
    if (dir === path.join(repo, '.rig', 'workers') && ['state.json', 'leases.json'].includes(entry.name)) continue;
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
  const modes = {};
  const outer = crypto.createHash('sha256');
  for (const rel of listFiles(repo)) {
    const abs = path.join(repo, rel);
    const stat = fs.lstatSync(abs);
    modes[rel] = stat.mode & 0o111;
    files[rel] = sha256(stat.isSymbolicLink()
      ? Buffer.from(`symlink\0${fs.readlinkSync(abs)}`)
      : Buffer.concat([Buffer.from(`file\0${modes[rel]}\0`), fs.readFileSync(abs)]));
    outer.update(`${rel}\0${files[rel]}\n`);
  }
  return { digest: COMMIT_PREFIX + outer.digest('hex'), files, modes };
}

function sourceSnapshot(repo) {
  return snapshot(requireRepo(repo));
}

function sourceDigest(repo) {
  return snapshot(requireRepo(repo)).digest;
}

function sourceFileCovered(repo, rel) {
  requireRepo(repo);
  let abs;
  try { abs = containedPath(repo, rel); } catch { return false; }
  try {
    if (!fs.lstatSync(abs).isFile() || fs.realpathSync(abs) !== abs) return false;
  } catch { return false; }
  const normalized = path.relative(fs.realpathSync(repo), abs).split(path.sep).join('/');
  return Object.hasOwn(snapshot(repo).files, normalized);
}

function evidenceDigest(repo) {
  const file = path.join(stateDir(requireRepo(repo)), 'evidence.jsonl');
  if (!fs.existsSync(file)) return sha256(Buffer.alloc(0));
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  const kept = lines.filter((line) => {
    if (!line) return false;
    try { return JSON.parse(line).kind !== 'publish'; } catch { return true; }
  });
  return sha256(Buffer.from(kept.length ? `${kept.join('\n')}\n` : ''));
}

function gitHead(repo) {
  const result = require('node:child_process').spawnSync('git', ['rev-parse', 'HEAD'], { cwd: repo, encoding: 'utf8' });
  const head = result.status === 0 ? result.stdout.trim() : '';
  if (!/^[a-f0-9]{40,64}$/.test(head)) throw new Error('candidate must have a full Git commit SHA');
  return head;
}

function repositoryIdentity(repo) {
  const result = require('node:child_process').spawnSync('git', ['config', '--get', 'remote.origin.url'], { cwd: repo, encoding: 'utf8' });
  if (result.status !== 0) throw new Error('candidate must have a configured GitHub origin');
  const origin = result.stdout.trim();
  const match = origin.match(/^(?:https:\/\/github\.com\/|ssh:\/\/git@github\.com\/|git@github\.com:)([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+?)(?:\.git)?\/?$/i);
  if (!match) throw new Error('candidate origin must identify one GitHub owner/repository');
  return match[1].toLowerCase();
}

function requireRepositoryIdentity(repo, requested) {
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(requested || '')) throw new Error('repository identity must be an owner/repository slug');
  const origin = repositoryIdentity(repo);
  if (origin !== requested.toLowerCase()) throw new Error('requested repository does not match the candidate GitHub origin');
  return origin;
}

function includedInCandidate(rel) {
  const parts = rel.split('/');
  if (parts[0] === 'wiki') return parts[1] === 'gate1';
  if (parts[0] !== '.rig') return !SKIP_AT_ROOT.has(parts[0])
    && !(parts[0].startsWith('.env.') && parts[0] !== '.env.example') && parts[0] !== '.env';
  if (parts.length === 1) return true;
  if (MUTABLE_RIG.has(parts[1])) return false;
  return !(parts[1] === 'workers' && ['state.json', 'leases.json'].includes(parts[2]));
}

function installedTrustRootProjectionMatchesGit(repo) {
  const rel = '.rig/trust/gate1.allowed-signers';
  const root = fs.realpathSync(repo);
  const projected = path.join(root, rel);
  const canonical = path.join(root, 'rig/corpus/trust/gate1.allowed-signers');
  let projectedStat;
  let canonicalStat;
  try {
    containedPath(root, rel);
    projectedStat = fs.lstatSync(projected);
    canonicalStat = fs.lstatSync(canonical);
  } catch { return false; }
  if (!canonicalStat.isFile() || fs.realpathSync(canonical) !== canonical) return false;
  if (projectedStat.isSymbolicLink()) {
    if (path.resolve(path.dirname(projected), fs.readlinkSync(projected)) !== canonical) return false;
    if (fs.realpathSync(projected) !== canonical) return false;
  } else if (!projectedStat.isFile()) return false;
  const committed = require('node:child_process').spawnSync('git', ['show', 'HEAD:rig/corpus/trust/gate1.allowed-signers'], { cwd: repo, encoding: 'buffer' });
  if (committed.status !== 0) return false;
  try { return fs.readFileSync(projected).equals(committed.stdout); } catch { return false; }
}

function requireCleanCandidate(repo) {
  const result = require('node:child_process').spawnSync('git', ['status', '--porcelain=v1', '-z', '--untracked-files=all'], { cwd: repo, encoding: 'buffer' });
  if (result.status !== 0) throw new Error('candidate Git status could not be verified');
  const entries = result.stdout.toString('utf8').split('\0').filter(Boolean);
  const rootProjectionValid = installedTrustRootProjectionMatchesGit(repo);
  if (entries.some((entry) => {
    const rel = entry.slice(3);
    return includedInCandidate(rel) && !(rel === '.rig/trust/gate1.allowed-signers' && rootProjectionValid);
  })) throw new Error('candidate source bytes must be committed before signing or external verification');
  const tracked = require('node:child_process').spawnSync('git', ['ls-files', '-z'], { cwd: repo, encoding: 'buffer' });
  if (tracked.status !== 0) throw new Error('candidate Git tree could not be verified');
  const paths = new Set(tracked.stdout.toString('utf8').split('\0').filter(Boolean));
  if (listFiles(repo).some((rel) => includedInCandidate(rel) && !paths.has(rel)
    && !(rel === '.rig/trust/gate1.allowed-signers' && rootProjectionValid))) {
    throw new Error('candidate snapshot includes source files outside its Git commit');
  }
}

function workerState(repo) {
  const file = containedPath(repo, '.rig/workers/state.json');
  let bytes;
  try { bytes = fs.readFileSync(file); } catch (error) {
    if (error.code === 'ENOENT') return { bytes: Buffer.from('{}'), accepted: [] };
    throw new Error('worker integration evidence could not be read');
  }
  let rows;
  try { rows = JSON.parse(bytes); } catch { throw new Error('worker integration evidence is malformed'); }
  if (!rows || typeof rows !== 'object' || Array.isArray(rows)) throw new Error('worker integration evidence is malformed');
  const accepted = Object.entries(rows).filter(([, row]) => row?.status === 'accepted');
  if (accepted.some(([, row]) => !Array.isArray(row.evidence) || !row.evidence.length)) {
    throw new Error('accepted worker packages need evidence before integration');
  }
  return { bytes, accepted };
}

// Local worker records stay provisional until the owner signs this one batch.
// The Git SHA identifies the hosted candidate; source_digest binds its actual
// bytes. They are separate because a filesystem snapshot hash is not a commit.
function prepareIntegrationBatch(repo, { commit, repository } = {}) {
  requireRepo(repo);
  requireCleanCandidate(repo);
  const approvedRepository = requireRepositoryIdentity(repo, repository);
  const gitSha = gitHead(repo);
  if (commit !== undefined && commit !== gitSha) throw new Error('integration batch commit must match the checked-out Git HEAD');
  const { bytes, accepted } = workerState(repo);
  const digest = sourceDigest(repo);
  if (accepted.some(([, row]) => row.candidate_digest !== digest)) throw new Error('worker evidence is stale for the current source bytes');
  const payload = {
    schema_version: 1,
    purpose: 'rig-worker-integration-v1',
    git_sha: gitSha,
    repository: approvedRepository,
    source_digest: digest,
    worker_state_digest: sha256(bytes),
    evidence_digest: evidenceDigest(repo),
    worker_count: accepted.length,
  };
  return { ...payload, message: `${JSON.stringify(payload)}\n` };
}

function verifyIntegrationBatch(repo, batch = {}) {
  try {
    requireRepo(repo);
    if (!batch || typeof batch.identity !== 'string' || typeof batch.signature !== 'string') return { valid: false, reason: 'owner-signed worker integration batch is missing' };
    const expected = prepareIntegrationBatch(repo, { commit: batch.commit, repository: batch.repository });
    const message = `${JSON.stringify({
      schema_version: expected.schema_version,
      purpose: expected.purpose,
      git_sha: expected.git_sha,
      repository: expected.repository,
      source_digest: expected.source_digest,
      worker_state_digest: expected.worker_state_digest,
      evidence_digest: expected.evidence_digest,
      worker_count: expected.worker_count,
    })}\n`;
    verifyTrustRootApproval(repo, { identity: batch.identity, namespace: 'rig-integration', message, signature: batch.signature });
    return { valid: true, git_sha: expected.git_sha, repository: expected.repository, source_digest: expected.source_digest, worker_count: expected.worker_count };
  } catch {
    return { valid: false, reason: 'worker integration signature or evidence did not verify against the current candidate and Gate 1 trust root' };
  }
}

function storeIntegrationBatch(repo, batch) {
  const result = verifyIntegrationBatch(repo, batch);
  if (!result.valid) throw new Error(result.reason);
  const file = containedPath(repo, '.rig/release/integration-batch.json');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify({
    schema_version: 1,
    commit: result.git_sha,
    repository: result.repository,
    identity: batch.identity,
    signature: batch.signature,
  }, null, 2)}\n`);
  return result;
}

function integrationStatus(repo, { commit } = {}) {
  const file = containedPath(repo, '.rig/release/integration-batch.json');
  try {
    const saved = JSON.parse(fs.readFileSync(file, 'utf8'));
    if (commit && saved.commit !== commit) return { valid: false, reason: 'integration batch is for a different Git commit' };
    return verifyIntegrationBatch(repo, saved);
  } catch {
    return { valid: false, reason: 'owner-signed worker integration batch is missing or unreadable' };
  }
}

async function verifyExternalChecks(repo, { commit, repository, token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN } = {}) {
  requireRepo(repo);
  requireCleanCandidate(repo);
  if (!/^[a-f0-9]{40,64}$/.test(commit || '')) throw new Error('external verification requires a full candidate Git SHA');
  const approvedRepository = requireRepositoryIdentity(repo, repository);
  if (typeof token !== 'string' || !token.trim()) throw new Error('external verification requires the existing GitHub API token');
  if (gitHead(repo) !== commit) throw new Error('external workflow SHA must match the checked-out Git HEAD');

  const headers = {
    Accept: 'application/vnd.github+json',
    Authorization: `Bearer ${token}`,
    'X-GitHub-Api-Version': '2022-11-28',
  };
  const request = async (url) => {
    let response;
    try { response = await fetch(url, { headers, signal: AbortSignal.timeout(15000) }); }
    catch { throw new Error('GitHub workflow verification could not reach the authenticated API'); }
    if (!response.ok) throw new Error(`GitHub workflow verification failed with HTTP ${response.status}`);
    try { return await response.json(); } catch { throw new Error('GitHub workflow verification returned malformed data'); }
  };

  let match;
  for (let page = 1; page <= 10 && !match; page += 1) {
    const url = `https://api.github.com/repos/${approvedRepository}/actions/workflows/release-eligibility.yml/runs?head_sha=${commit}&per_page=100&page=${page}`;
    const data = await request(url);
    const runs = Array.isArray(data?.workflow_runs) ? data.workflow_runs : null;
    if (!runs) throw new Error('GitHub workflow verification returned malformed run data');
    const candidates = runs.filter((run) => run?.head_sha === commit && run?.head_branch === 'qa-prod'
      && run?.head_repository?.full_name?.toLowerCase() === approvedRepository
      && run?.event === 'workflow_dispatch' && Number.isSafeInteger(run?.workflow_id))
      .sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    if (candidates.length) match = candidates[0];
    if (runs.length < 100) break;
  }
  if (!match) throw new Error('no exact-SHA QA release-eligibility workflow run exists');
  if (match.status !== 'completed' || match.conclusion !== 'success') throw new Error('the latest exact-SHA QA release-eligibility workflow did not pass');
  const workflow = await request(`https://api.github.com/repos/${approvedRepository}/actions/workflows/${match.workflow_id}`);
  if (workflow?.path !== RELEASE_WORKFLOW_PATH || workflow?.state !== 'active') {
    throw new Error('the passing GitHub run is not from the active release-eligibility workflow');
  }
  const proof = Object.freeze({
    verified: true,
    repository: approvedRepository,
    workflow_path: workflow.path,
    workflow_run_id: match.id,
    git_sha: commit,
    source_digest: sourceDigest(repo),
    verified_at: Date.now(),
  });
  externalProofs.add(proof);
  return proof;
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

function authorizationMessageForEvidence(repo, { commit, identity, nonce, expires_at, evidence_digest } = {}) {
  requireRepo(repo);
  if (!/^sha256:[a-f0-9]{64}$/.test(commit || '')) throw new Error('authorization requires an exact candidate digest');
  if (typeof identity !== 'string' || !/^[A-Za-z0-9_.@-]+$/.test(identity)) throw new Error('authorization requires a principal');
  if (typeof nonce !== 'string' || !/^[a-f0-9]{32,128}$/.test(nonce)) throw new Error('authorization requires a fresh nonce');
  if (!/^[a-f0-9]{64}$/.test(evidence_digest || '')) throw new Error('authorization requires a release evidence digest');
  const expiry = Date.parse(expires_at);
  if (!Number.isFinite(expiry)) throw new Error('authorization must have a valid expiration');
  const artifact_digest = publicationArtifactDigest(repo, commit);
  return JSON.stringify({ purpose: 'rig-release-v1', repo: fs.realpathSync(repo), commit, evidence_digest, artifact_digest, identity, nonce, expires_at }) + '\n';
}

function authorizationMessage(repo, { commit, identity, nonce, expires_at } = {}) {
  const expiry = Date.parse(expires_at);
  if (!Number.isFinite(expiry) || expiry <= Date.now() || expiry > Date.now() + 15 * 60 * 1000) throw new Error('authorization must expire within fifteen minutes');
  return authorizationMessageForEvidence(repo, { commit, identity, nonce, expires_at, evidence_digest: evidenceDigest(repo) });
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
    return { eligible: false, reason: `qa commit missing or stale for ${commit}: no qa-commit evidence, or source bytes changed since it was recorded`, evidence_assurance: 'provisional', production_certified: false };
  }
  if (!passing(rows, 'health', commit)) {
    return { eligible: false, reason: `health evidence missing, stale or failing for ${commit}`, evidence_assurance: 'provisional', production_certified: false };
  }
  if (!passing(rows, 'clean-install', commit)) {
    return { eligible: false, reason: `install evidence missing, stale or not a real download for ${commit}`, evidence_assurance: 'provisional', production_certified: false };
  }
  return { eligible: true, reason: '', evidence_assurance: 'provisional', production_certified: false };
}

function refused(reason) {
  return { published: false, reason, cryptographic_signature: false };
}

function publicationArtifactBytes(repo, commit, assurance) {
  const final = snapshot(repo);
  if (final.digest !== commit) throw new Error('candidate source bytes changed after authorization');
  return Buffer.from(`${JSON.stringify({ commit, files: final.files, authorized: true, assurance }, null, 2)}\n`);
}

function publicationAssurance(repo) {
  const signoff = require('./user-signoff');
  const policy = signoff.current(repo);
  return { ...signoff.signatureAssurance(repo, policy?.key_protection || 'unspecified'), approval_mode: 'cryptographic' };
}

function publicationArtifactDigest(repo, commit) {
  return COMMIT_PREFIX + sha256(publicationArtifactBytes(repo, commit, publicationAssurance(repo)));
}

async function publish(repo, { commit, authorization, external_checks, token } = {}) {
  requireRepo(repo);
  requireCommit(commit);
  const approvedEvidence = evidenceDigest(repo);
  const hasMaterial = authorization && (authorization.signed_by || typeof authorization.signature === 'string'
    || authorization.acknowledgement || authorization.receipt);
  if (!hasMaterial) return refused('protected action requires owner authorization; a readiness report is not authorization');
  if (!/^sha256:[a-f0-9]{64}$/.test(commit)) return refused('authorization requires an exact candidate digest');

  if (typeof authorization.signature !== 'string') {
    return refused('production publication requires a real signature verified by the single Gate 1 trust root');
  }
  if (sourceDigest(repo) !== commit) return refused('candidate source bytes changed after authorization; rerun evidence and approval');
  try {
    verifyTrustRootApproval(repo, {
      identity: authorization.identity,
      namespace: 'rig-release',
      message: authorizationMessage(repo, { ...authorization, commit }),
      signature: authorization.signature,
    });
  } catch {
    return refused('owner authorization did not verify against the single Gate 1 trust root');
  }
  let origin;
  try { origin = repositoryIdentity(repo); } catch {}
  if (!external_checks || !externalProofs.has(external_checks)
    || external_checks.git_sha !== gitHead(repo) || external_checks.source_digest !== commit
    || external_checks.repository !== origin) {
    return refused('production publication requires freshly verified GitHub release checks for the exact Git SHA and source bytes');
  }
  let latestExternalChecks;
  try {
    latestExternalChecks = await verifyExternalChecks(repo, {
      commit: external_checks.git_sha, repository: external_checks.repository, token,
    });
  } catch {
    return refused('production publication requires the latest exact-SHA GitHub release workflow to pass');
  }
  try {
    verifyTrustRootApproval(repo, {
      identity: authorization.identity,
      namespace: 'rig-release',
      message: authorizationMessage(repo, { ...authorization, commit }),
      signature: authorization.signature,
    });
  } catch {
    return refused('owner authorization expired or release evidence changed during external verification');
  }
  const integrated = integrationStatus(repo, { commit: latestExternalChecks.git_sha });
  if (!integrated.valid || integrated.source_digest !== commit) {
    return refused('production publication requires the owner-signed worker integration batch for the exact candidate');
  }
  if (integrated.repository !== latestExternalChecks.repository) {
    return refused('signed worker integration batch and verified CI evidence name different repositories');
  }

  // Lazy require: user-signoff verifies release signatures through this module.
  const readiness = publicReadiness(repo, { commit });
  if (!readiness.ready) return refused(readiness.reason);
  // rig: publication always needs the existing root signature, regardless of
  // the lower-assurance mode selected for ordinary actions.
  const assurance = publicationAssurance(repo);

  const verdict = eligible(repo, { commit });
  if (!verdict.eligible) return refused(verdict.reason);

  const artifact = path.posix.join('.rig', 'release', 'published', `${commit.slice(COMMIT_PREFIX.length)}.json`);
  const abs = containedPath(repo, artifact);
  if (fs.existsSync(abs)) return refused(`commit already published: ${artifact}`);

  let bytes;
  try { bytes = publicationArtifactBytes(repo, commit, assurance); }
  catch { return refused('candidate changed during authorization; rerun evidence and approval'); }
  if (evidenceDigest(repo) !== approvedEvidence) return refused('release evidence changed during authorization; rerun evidence and approval');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const proof = {
    schema_version: 1,
    commit,
    identity: authorization.identity,
    nonce: authorization.nonce,
    expires_at: authorization.expires_at,
    evidence_digest: approvedEvidence,
    artifact_digest: COMMIT_PREFIX + sha256(bytes),
    signature: authorization.signature,
  };
  const proofFile = containedPath(repo, artifact.replace(/\.json$/, '.proof.json'));
  fs.writeFileSync(proofFile, `${JSON.stringify(proof, null, 2)}\n`, { flag: 'wx' });
  try { fs.writeFileSync(abs, bytes, { flag: 'wx' }); }
  catch (error) { fs.rmSync(proofFile, { force: true }); throw error; }
  const artifact_digest = COMMIT_PREFIX + sha256(bytes);
  appendRow(repo, 'evidence.jsonl', { kind: 'publish', status: 'pass', commit, artifact, artifact_digest, recorded_at: new Date().toISOString() });
  return { published: true, commit, artifact, artifact_digest, assurance, cryptographic_signature: true,
    production_certified: true, evidence_assurance: 'verified-external+signed-integration+release-signature' };
}

function publicReadiness(repo, { commit } = {}) {
  requireRepo(repo);
  requireCommit(commit);
  if (commit !== sourceDigest(repo)) {
    return { ready: false, reason: `stale candidate: source bytes changed since ${commit}`, missing: [...REQUIRED_PUBLIC], evidence_assurance: 'provisional', production_certified: false };
  }
  const rows = rowsOf(repo, 'evidence.jsonl');
  const missing = REQUIRED_PUBLIC.filter((kind) => !passing(rows, kind, commit));
  if (missing.length === 0) return { ready: true, reason: '', missing: [], evidence_assurance: 'provisional', production_certified: false };
  return { ready: false, reason: `missing or failing evidence: ${missing.join(', ')}`, missing, evidence_assurance: 'provisional', production_certified: false };
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
  const proofFile = containedPath(root, artifact.replace(/\.json$/, '.proof.json'));
  let proof = null;
  try { proof = JSON.parse(fs.readFileSync(proofFile, 'utf8')); } catch {}
  let bytes = null;
  let expected = null;
  let digest = null;
  try {
    const commit = proof?.commit;
    if (!proof || proof.schema_version !== 1 || !/^sha256:[a-f0-9]{64}$/.test(commit || '')
      || artifact !== path.posix.join('.rig', 'release', 'published', `${commit.slice(COMMIT_PREFIX.length)}.json`)
      || proof.evidence_digest !== evidenceDigest(repo)) throw new Error('publication proof is missing or stale');
    if (proof.artifact_digest !== publicationArtifactDigest(repo, commit)) throw new Error('publication proof does not authorize these artifact bytes');
    const message = authorizationMessageForEvidence(repo, proof);
    verifyTrustRootApproval(repo, { identity: proof.identity, namespace: 'rig-release', message, signature: proof.signature });
    expected = publicationArtifactBytes(repo, commit, publicationAssurance(repo));
    bytes = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
    digest = bytes ? COMMIT_PREFIX + sha256(bytes) : null;
  } catch {}
  const artifact_digest = digest;
  const authentic = Boolean(publish && bytes && expected && bytes.equals(expected) && publish.artifact_digest === artifact_digest);
  const healthy = health === 'pass' && authentic;
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

module.exports = {
  record, check, eligible, publish, publicReadiness, validatePublished, incidents,
  sourceDigest, sourceSnapshot, sourceFileCovered, evidenceDigest, authorizationMessage,
  prepareIntegrationBatch, verifyIntegrationBatch, storeIntegrationBatch, integrationStatus, verifyExternalChecks,
};
