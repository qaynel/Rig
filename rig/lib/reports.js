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
    fix_context: report.fix_context || [],
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

module.exports = { writeReport, ALLOWED };
