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

function evaluateAction(policy, action) {
  const surface = action && action.surface;
  const enforcement = (policy && policy.enforcement) || {};
  if (surface && enforcement[surface] === false) {
    return { decision: 'disabled', surface, rule: null };
  }
  const category = action && action.category;
  const rule = category || 'unknown';
  const allow = (policy && policy.allow) || [];
  if (allow.includes(rule)) {
    return { decision: 'allow', surface, rule };
  }
  return { decision: 'deny', surface, rule };
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
