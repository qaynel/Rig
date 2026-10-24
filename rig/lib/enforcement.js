'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { policyPath, syncDirectory } = require('./policy-transaction');
const { gitPath } = require('./path-safety');
const { verifyTrustRootApproval } = require('./trust-root');

function digest(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// rig: action digest currently uses JSON.stringify, which is key-order-
// sensitive. Ceiling: a caller that reorders action fields will get a false
// mismatch. Upgrade path: switch to a canonical serialiser (sorted keys) when
// the oracle re-signs — today's frozen fixture builds the digest with
// JSON.stringify, so the callers must match.
function actionDigest(action) {
  return digest(JSON.stringify(action));
}

// Enforcement leaves per surface: [legacy key, current key]. Both schemas pass
// through effectiveStatus, so a global or section switch, a leaf switch, or a
// missing leaf yields the same state here that `policy status` reports.
const SURFACE_LEAF = { shell: ['shell', 'host.shell'], web: ['web', 'host.web'], mcp: ['mcp', 'host.mcp'] };

function evaluateAction(policy, action) {
  const { effectiveStatus, NETWORK_CATEGORIES } = require('./policy');
  const surface = action && action.surface;
  const rule = (action && action.category) || 'unknown';
  if (!policy || typeof policy !== 'object' || Array.isArray(policy)) {
    return { decision: 'deny', surface, rule, reason: 'policy_invalid' };
  }
  const leaves = SURFACE_LEAF[surface];
  if (!leaves) return { decision: 'deny', surface, rule, reason: 'unknown_surface' };
  const status = effectiveStatus(policy);
  const leaf = leaves.find((key) => key in status.enforcement);
  if (!leaf || status.enforcement[leaf] !== 'enabled') {
    return { decision: 'disabled', surface, rule: null, reasons: (leaf && status.reasons[`enforcement.${leaf}`]) || ['missing'] };
  }
  const allow = Array.isArray(policy.allow) ? policy.allow : [];
  if (NETWORK_CATEGORIES.includes(rule) && rule in status.network) {
    const gate = status.controls['network.action_policy'];
    if (status.network[rule] !== 'enabled' || gate === 'disabled') {
      return { decision: 'disabled', surface, rule: null, reasons: status.reasons[`network.categories.${rule}`] || status.reasons['controls.network.action_policy'] || [] };
    }
    if (policy.network.categories[rule] === 'allow') return { decision: 'allow', surface, rule };
  }
  return { decision: allow.includes(rule) ? 'allow' : 'deny', surface, rule };
}

function consumeOneUseApproval(approval, action, options) {
  if (options?.target) return consumeSignedApproval(options.target, approval, action);
  // rig: two-argument helper models consumption for the frozen oracle only;
  // every shipping dispatcher supplies target and verifies persistent authority.
  if (!approval) throw new Error('consumeOneUseApproval: approval required');
  const expected = actionDigest(action);
  if (approval.action_digest !== expected) {
    throw new Error('consumeOneUseApproval: action changed since approval; digest mismatch');
  }
  if (approval.used) {
    throw new Error('consumeOneUseApproval: approval already used (replay refused)');
  }
  approval.used = true;
  approval.used_at = new Date().toISOString();
  return { decision: 'allow_once', consumed: true };
}

function approvalStorage(target, leaf) {
  const gitDir = gitPath(target, '');
  if (!gitDir) throw new Error('action approval: clone-local Git storage unavailable');
  const root = fs.realpathSync(gitDir);
  let cursor = root;
  for (const part of ['rig', 'approvals', leaf]) {
    if (!part || !/^[a-zA-Z0-9.-]+$/.test(part)) throw new Error('action approval: invalid storage leaf');
    cursor = path.join(cursor, part);
    try { if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error('action approval: storage follows a symlink'); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  return cursor;
}
function approvalCloneId(target) {
  const file = approvalStorage(target, 'clone-id');
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (!fs.existsSync(file)) {
    let fd;
    try { fd = fs.openSync(file, 'wx', 0o600); fs.writeFileSync(fd, crypto.randomBytes(32).toString('hex')); fs.fsyncSync(fd); }
    catch (error) { if (error.code !== 'EEXIST') throw error; }
    finally { if (fd !== undefined) fs.closeSync(fd); }
  }
  const id = fs.readFileSync(file, 'utf8');
  if (!/^[a-f0-9]{64}$/.test(id)) throw new Error('action approval: malformed clone identity');
  return id;
}
function actionContext(target) {
  const { loadActivePolicy } = require('./policy');
  const active = loadActivePolicy(target);
  const git = (args) => {
    const result = spawnSync('git', args, { cwd: target, encoding: 'utf8', shell: false, maxBuffer: 32 * 1024 * 1024 });
    if (result.error || result.status !== 0) throw new Error('action approval: repository context unavailable');
    return result.stdout;
  };
  const paths = git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean)
    .filter((rel) => !rel.startsWith('.rig/approvals/') && !rel.startsWith('reports/rig/') && !rel.startsWith('.context/'));
  const inputs = [...new Set(paths)].sort().map((rel) => {
    const abs = policyPath(target, rel);
    if (!fs.existsSync(abs)) return [rel, null];
    const stat = fs.lstatSync(abs);
    if (!stat.isFile()) throw new Error(`action approval: unsupported input ${rel}`);
    return [rel, stat.mode & 0o777, digest(fs.readFileSync(abs))];
  });
  return { clone_id: approvalCloneId(target), policy_digest: active.digest, generation: active.generation, inputs_digest: digest(JSON.stringify(inputs)), index_digest: digest(git(['ls-files', '--stage', '-z'])) };
}
function createActionApprovalProposal(target, action) {
  if (!action || typeof action.surface !== 'string' || typeof action.category !== 'string') throw new Error('action approval: complete action required');
  return { schema_version: 1, kind: 'action-approval', repository: fs.realpathSync(target), action_digest: actionDigest(action),
    context: actionContext(target), nonce: crypto.randomBytes(32).toString('hex') };
}
function actionApprovalMessage(proposal) { return `rig-action-approval-v1\n${digest(JSON.stringify(proposal))}\n`; }
function verifyActionApproval(target, grant, action) {
  if (!grant?.proposal || !grant?.authorization) throw new Error('action approval: signed grant required');
  const p = grant.proposal;
  if (p.schema_version !== 1 || p.kind !== 'action-approval' || !/^[a-f0-9]{64}$/.test(p.nonce || '') || p.repository !== fs.realpathSync(target)) {
    throw new Error('action approval: grant belongs to another repository or is malformed');
  }
  if (p.action_digest !== actionDigest(action)) throw new Error('action approval: action changed; digest mismatch');
  verifyTrustRootApproval(target, { ...grant.authorization, namespace: 'rig-action-approval', message: actionApprovalMessage(p) });
  if (JSON.stringify(p.context) !== JSON.stringify(actionContext(target))) throw new Error('action approval: current context changed; grant is stale');
  return digest(JSON.stringify(p));
}
function consumeSignedApproval(target, grant, action) {
  const id = verifyActionApproval(target, grant, action);
  const file = approvalStorage(target, `${id}.json`);
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== `${JSON.stringify(grant)}\n`) throw new Error('action approval: issued signed grant missing, revoked or altered');
  const revoked = approvalStorage(target, `${id}.revoked`);
  if (fs.existsSync(revoked)) throw new Error('action approval: grant revoked');
  const used = approvalStorage(target, `${id}.consumed`);
  let fd;
  try { fd = fs.openSync(used, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('action approval already used (persistent replay refused)'); throw error; }
  try { fs.writeFileSync(fd, `${JSON.stringify({ id, action_digest: actionDigest(action) })}\n`); fs.fsyncSync(fd); }
  finally { fs.closeSync(fd); }
  syncDirectory(path.dirname(used));
  // Recheck the relevant context after winning consumption. A change burns the
  // grant and refuses dispatch rather than permitting a stale action.
  verifyActionApproval(target, grant, action);
  return { decision: 'allow_once', consumed: true, grant_id: id };
}
function dispatchAction(target, action, { approval, execute } = {}) {
  const active = require('./policy').loadActivePolicy(target);
  let result = evaluateAction(active.policy, action);
  if (result.decision === 'deny' && approval) result = consumeOneUseApproval(approval, action, { target });
  if (result.decision === 'deny') return result;
  if (execute) return { ...result, execution: execute(action) };
  return result;
}
module.exports = { evaluateAction, consumeOneUseApproval, actionDigest, actionContext, createActionApprovalProposal,
  actionApprovalMessage, verifyActionApproval, dispatchAction, approvalStorage };
