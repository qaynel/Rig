'use strict';

const crypto = require('node:crypto');

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

function consumeOneUseApproval(approval, action) {
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

module.exports = { evaluateAction, consumeOneUseApproval, actionDigest };
