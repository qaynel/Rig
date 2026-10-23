#!/usr/bin/env node
// Target-local exact-copy checker driven by .rig/sync-map.json (impl-design §7.3).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('../lib/path-safety');
const { redact } = require('../lib/redaction');
const { projectCiResult } = require('../lib/reports');

// containedPath walks every intermediate path segment, not just the leaf --
// a leaf-only symlink check (the previous implementation here) misses a
// symlinked *directory* partway through `rel`, which resolves outside root
// without the leaf itself ever being a symlink.
function inspectInside(root, rel, kind) {
  let abs;
  try {
    abs = containedPath(root, rel);
  } catch {
    return { ok: false, reason: `out-of-root ${kind} path: ${rel}` };
  }
  if (!fs.existsSync(abs)) {
    return { ok: false, reason: `missing ${kind}: ${rel}` };
  }
  return { ok: true, abs };
}

function main() {
  const root = path.resolve(__dirname, '..', '..');
  const mapPath = path.join(root, '.rig', 'sync-map.json');
  if (!fs.existsSync(mapPath)) {
    return;
  }
  const failures = [];
  try {
    const map = JSON.parse(fs.readFileSync(mapPath, 'utf8'));
    for (const group of map.groups || []) {
      const canonical = inspectInside(root, group.canonical, 'canonical');
      if (!canonical.ok) {
        failures.push({ rule: safeReason(canonical.reason), message: localDiagnostic(canonical.reason) });
        continue;
      }
      const canonBytes = fs.readFileSync(canonical.abs);
      for (const copyRel of group.copies || []) {
        const copy = inspectInside(root, copyRel, 'copy');
        if (!copy.ok) {
          failures.push({ rule: safeReason(copy.reason), message: localDiagnostic(copy.reason) });
          continue;
        }
        const copyBytes = fs.readFileSync(copy.abs);
        if (!canonBytes.equals(copyBytes)) failures.push({
          rule: 'byte_drift', message: redact(`byte drift: ${copyRel} != ${group.canonical}`),
        });
      }
    }
  } catch {
    // rig: parsing and read errors disclose no user-controlled input or stack.
    failures.push({ rule: 'check_failed' });
  }
  if (failures.length) {
    if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
      process.stdout.write(`${JSON.stringify(projectCiResult({ status: 1, findings: failures }))}\n`);
    } else {
      for (const failure of failures) process.stderr.write(`${failure.message || safeLabel(failure.rule)}\n`);
    }
    process.exitCode = 1;
  }
}

function safeReason(reason) {
  if (reason.startsWith('out-of-root canonical path:')) return 'out_of_root_canonical_path';
  if (reason.startsWith('missing canonical:')) return 'missing_canonical';
  if (reason.startsWith('out-of-root copy path:')) return 'out_of_root_copy_path';
  if (reason.startsWith('missing copy:')) return 'missing_copy';
  return 'check_failed';
}

function localDiagnostic(reason) {
  const pathValue = reason.slice(reason.indexOf(':') + 1).trim();
  // Absolute paths can disclose a host identity or filesystem layout. Keep the
  // failure kind locally, and retain redacted repo-relative locations.
  return path.isAbsolute(pathValue) || path.win32.isAbsolute(pathValue)
    ? safeLabel(safeReason(reason))
    : redact(reason);
}

function safeLabel(rule) {
  if (rule === 'byte_drift') return 'byte drift detected across sync group';
  if (rule === 'out_of_root_canonical_path') return 'out-of-root canonical path';
  if (rule === 'missing_canonical') return 'missing canonical';
  if (rule === 'out_of_root_copy_path') return 'out-of-root copy path';
  if (rule === 'missing_copy') return 'missing copy';
  return 'exact-copy check failed';
}

if (require.main === module) main();
module.exports = { main, inspectInside };
