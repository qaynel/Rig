'use strict';

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const HARNESS_NAMES = new Set(['AGENTS.md', 'CLAUDE.md', 'GEMINI.md', '.cursorrules']);
const SUSPICIOUS = /ignore .*(safety|prior instructions)|exfiltrat|curl .*evil/i;
const SECRET_RE = /(?<![a-z0-9])sk-[a-z0-9-]{10,}|gh[opsur]_[a-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |OPENSSH |EC |DSA )?PRIVATE KEY-----/i;

function stagedHarnessFiles(target) {
  const result = spawnSync('git', ['diff', '--cached', '--name-only'], {
    cwd: target,
    encoding: 'utf8',
    shell: false,
  });
  if (result.status !== 0) {
    // Do not silently open the gate when git itself failed. Caller must
    // treat this as a scan failure, not a clean scan.
    return { ok: false };
  }
  const files = result.stdout.split('\n').map((line) => line.trim()).filter(Boolean).filter((rel) => {
    if (HARNESS_NAMES.has(rel)) return true;
    return rel.startsWith('.cursor/') || rel.startsWith('.claude/') || rel.startsWith('.agents/') || rel.startsWith('.kiro/');
  });
  return { ok: true, files };
}

function runPreCommit(target, policy) {
  const steps = [];
  const findings = [];
  const controls = (policy && policy.controls) || {};

  if (controls.sanitation !== false) {
    steps.push('sanitation');
    const staged = stagedHarnessFiles(target);
    if (!staged.ok) {
      findings.push({ path: null, kind: 'scan_unavailable' });
    } else {
      for (const rel of staged.files) {
        const abs = path.join(target, rel);
        if (!fs.existsSync(abs)) continue;
        const text = fs.readFileSync(abs, 'utf8');
        if (SUSPICIOUS.test(text)) findings.push({ path: rel, kind: 'suspicious_directive' });
        if (SECRET_RE.test(text)) findings.push({ path: rel, kind: 'secret_shaped' });
      }
    }
  }

  // Named controls only appear in `steps` once the scan actually runs.
  // Recording a label without running the scan does not pass the gate.

  return { allowed: findings.length === 0, steps, findings };
}

module.exports = { runPreCommit };
