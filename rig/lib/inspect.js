// Bounded harness inspection (impl-design §5.2, AD-7).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { validateReview, VERDICTS, KNOWN_RESTRICTIONS } = require('./catalog');
const { discoverHosts } = require('./host-capabilities');

const MAX_BYTES = 256 * 1024;
const HARNESS_NAMES = new Set([
  'AGENTS.md',
  'CLAUDE.md',
  'GEMINI.md',
  '.cursorrules',
  'copilot-instructions.md',
]);
const HARNESS_DIRS = [
  '.cursor/rules',
  '.windsurf/rules',
  '.clinerules',
  '.agents/rules',
  '.agents/skills',
  '.claude/skills',
  '.kiro/steering',
  'hooks',
];
const SECRET_RE =
  /(?<![a-z0-9])sk-[a-z0-9-]{10,}|gh[po]_[a-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----/gi;

function redact(text) {
  return String(text).replace(SECRET_RE, '[REDACTED]');
}

function sha256(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex');
}

function realpathOrNull(p) {
  try {
    return fs.realpathSync(p);
  } catch {
    return null;
  }
}

function collectHarnessFiles(target) {
  const out = [];
  for (const name of HARNESS_NAMES) {
    const p = path.join(target, name);
    if (fs.existsSync(p)) out.push(p);
  }
  const githubCopilot = path.join(target, '.github', 'copilot-instructions.md');
  if (fs.existsSync(githubCopilot)) out.push(githubCopilot);
  for (const dir of HARNESS_DIRS) {
    const abs = path.join(target, dir);
    if (!fs.existsSync(abs)) continue;
    const walk = (d, ancestors = new Set()) => {
      const real = realpathOrNull(d);
      if (real && ancestors.has(real)) return;
      const nextAncestors = new Set(ancestors);
      if (real) nextAncestors.add(real);
      for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
        const p = path.join(d, entry.name);
        if (entry.isDirectory()) {
          walk(p, nextAncestors);
          continue;
        }
        if (entry.isSymbolicLink()) {
          const resolved = realpathOrNull(p);
          if (resolved && (resolved.startsWith(target + path.sep) || resolved === target)) {
            try {
              if (fs.statSync(p).isDirectory()) {
                walk(p, nextAncestors);
                continue;
              }
            } catch {
              /* inspectTarget records unreadable symlinks below */
            }
          }
        }
        out.push(p);
      }
    };
    walk(abs);
  }
  return out;
}

function inspectTarget(target, { host, hosts } = {}) {
  const root = realpathOrNull(target);
  if (!root || !fs.existsSync(root)) throw new Error('inspect: target must exist');
  const explicit = host ? [host] : Array.isArray(hosts) ? hosts : [];
  const detectedHosts = discoverHosts(root, { explicit });

  const findings = [];
  const inputs = [];
  const hash = crypto.createHash('sha256');

  for (const file of collectHarnessFiles(root)) {
    const rel = path.relative(root, file);
    let st;
    try {
      st = fs.lstatSync(file);
    } catch (error) {
      findings.push({ path: rel, kind: 'unreadable', detail: String(error.message) });
      continue;
    }
    if (st.isSymbolicLink()) {
      const resolved = realpathOrNull(file);
      if (!resolved || !resolved.startsWith(root + path.sep) && resolved !== root) {
        throw new Error(`inspect: escaping symlink rejected at ${rel}`);
      }
    }
    if (st.size > MAX_BYTES) {
      findings.push({ path: rel, kind: 'oversized', bytes: st.size, limit: MAX_BYTES });
      hash.update(rel);
      hash.update(`oversized:${st.size}`);
      continue;
    }
    const bytes = fs.readFileSync(file);
    const digest = sha256(bytes);
    hash.update(rel);
    hash.update(digest);
    const text = bytes.toString('utf8');
    const redacted = redact(text);
    inputs.push({ path: rel, sha256: digest, bytes: st.size });
    if (/exfiltrat|ignore prior|curl .*evil|bypass.*(guard|permission)/i.test(text)) {
      findings.push({
        path: rel,
        kind: 'suspicious_directive',
        evidence: redact(text.slice(0, 240)),
      });
    }
    if (SECRET_RE.test(text)) {
      SECRET_RE.lastIndex = 0;
      findings.push({
        path: rel,
        kind: 'secret_shaped',
        evidence: '[REDACTED]',
      });
    }
    void redacted;
  }

  return {
    schema_version: 1,
    ...(host ? { host } : {}),
    hosts: detectedHosts,
    harness_digest: hash.digest('hex'),
    inputs,
    findings,
    redaction: 'secret-shaped evidence redacted',
  };
}

function adoptionVerdict({ findings = [], unverifiable = [] } = {}) {
  const blockers = findings.filter((f) => f && f.severity === 'blocker');
  if (blockers.length) return { verdict: 'BLOCK', findings: blockers, unverifiable };
  if (unverifiable.length) return { verdict: 'QUARANTINE', findings, unverifiable };
  return { verdict: 'ALLOW', findings, unverifiable };
}

module.exports = {
  MAX_BYTES,
  inspectTarget,
  redact,
  validateReview,
  validateVerdict: validateReview,
  VERDICTS,
  KNOWN_RESTRICTIONS,
  adoptionVerdict,
};
