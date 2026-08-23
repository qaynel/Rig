// Report writer (impl-design §8.3, AD-16).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { redact } = require('./inspect');

const ALLOWED = new Set(['failed', 'vacuous', 'coverage_gap']);

function writeReport(target, report) {
  if (!ALLOWED.has(report.status)) {
    throw new Error(`reports omit routine passes; refused status ${report.status}`);
  }
  const dir = path.join(target, 'reports', 'rig');
  fs.mkdirSync(dir, { recursive: true });
  const body = {
    schema_version: 1,
    run_id: report.run_id || `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
    service_id: report.service_id,
    grade: report.grade || null,
    effective_slices: report.effective_slices || [],
    scope: report.scope || 'repo',
    status: report.status,
    summary: redact(report.summary || ''),
    reason: redact(report.reason || ''),
    evidence: (report.evidence || []).map((e) => redact(typeof e === 'string' ? e : JSON.stringify(e))),
    fix_context: (report.fix_context || []).map((c) => redact(typeof c === 'string' ? c : JSON.stringify(c))),
    rerun: report.rerun || ['node', '.rig/bin/check.js', '--scope', report.scope || 'repo'],
  };
  const digest = crypto.createHash('sha256').update(JSON.stringify(body)).digest('hex').slice(0, 12);
  const file = path.join(dir, `${body.run_id}-${digest}.json`);
  const fd = fs.openSync(file, 'wx');
  try {
    fs.writeFileSync(fd, `${JSON.stringify(body, null, 2)}\n`);
  } finally {
    fs.closeSync(fd);
  }
  return file;
}

function projectCiResult(local) {
  const findings = (local && local.findings) || [];
  const counts = {};
  const rules = [];
  for (const finding of findings) {
    const rule = finding.rule || 'unknown';
    counts[rule] = (counts[rule] || 0) + 1;
    if (!rules.includes(rule)) rules.push(rule);
  }
  const verdict = (local && local.status === 'failed') || findings.length ? 'fail' : 'pass';
  return { verdict, counts, rules };
}

// Disclosure text shown when a user turns model-assisted triage on. It names
// what will now enter the agent's context and why the user is choosing that,
// so the choice is informed. Do not shorten without owner review — this is the
// consent copy the redaction design requires.
const TRIAGE_DISCLOSURE = [
  'You are about to enable model-assisted triage.',
  'While this is on, matched secret and PII content will enter the agent context alongside the finding metadata.',
  'The host model is a third party: a credential placed in its context cannot be unsent, only rotated.',
  'This lets the agent explain, correlate, or draft fixes for the finding, and it also means the exact matched bytes appear in the agent\'s prompt and any transcript or log of that turn.',
  'Only turn this on for a specific triage session, on a specific finding, and turn it back off when you are done.',
].join(' ');

// Enable triage explicitly. `reason` is the user\'s stated purpose (a short
// free-text string). Callers must persist the returned record and pass it back
// to `projectForAgent` as `options.triage_authorization`; without a fresh
// record, projectForAgent falls back to the redacted view.
function enableTriageDisclosure(reason) {
  if (!reason || typeof reason !== 'string' || !reason.trim()) {
    throw new Error('enableTriageDisclosure: reason required');
  }
  return {
    granted: true,
    reason: reason.trim(),
    disclosure_text: TRIAGE_DISCLOSURE,
    granted_at: new Date().toISOString(),
  };
}

function projectForAgent(report, options = {}) {
  const findings = (report && report.findings) || [];
  let authorized = false;
  if (options.target) {
    const status = require('./policy').policyStatus(options.target);
    authorized = status.model_assisted_triage.authorized === true;
  }
  if (authorized) {
    return { findings: findings.map((f) => ({ ...f })) };
  }
  return {
    findings: findings.map((f) => ({
      rule: f.rule || null,
      path: f.path || null,
      redacted: true,
    })),
  };
}

module.exports = {
  writeReport,
  ALLOWED,
  projectCiResult,
  projectForAgent,
  enableTriageDisclosure,
  TRIAGE_DISCLOSURE,
};
