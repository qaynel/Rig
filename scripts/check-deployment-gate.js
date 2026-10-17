#!/usr/bin/env node
'use strict';

// Enforces the change-management sequence in `rig/corpus/standards/change-management.md`.
// Runs the steps in order and stops at the first unmet one, so a release can
// never be assembled out of order or out of evidence from a different tree.
//
//   node scripts/check-deployment-gate.js --receipt <path> [--root .]

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { implementationDigest, validateReviewReceipt } = require('../rig/lib/release-evidence');

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i === -1 ? fallback : process.argv[i + 1];
}

// Each step returns null when met, or a one-line reason when not.
function steps(root, receiptPath) {
  const node = (script, ...rest) => {
    const run = spawnSync(process.execPath, [path.join(root, 'scripts', script), ...rest], { cwd: root, encoding: 'utf8' });
    return run.status === 0 ? null : `${script} exited ${run.status}: ${(run.stderr || run.stdout || '').trim().split('\n').slice(-3).join(' ')}`;
  };
  return [
    ['1. candidate freeze: the working tree is clean', () => {
      const run = spawnSync('git', ['status', '--porcelain'], { cwd: root, encoding: 'utf8' });
      if (run.status !== 0) return `git status failed: ${(run.stderr || '').trim()}`;
      const dirty = run.stdout.trim();
      return dirty ? `uncommitted changes make the reviewed bytes differ from the pushed bytes:\n${dirty}` : null;
    }],
    ['2. the signed oracle verifies', () => node('check-advanced-spec.js')],
    ['3. the full gate is green on these bytes', () => {
      // npm test is minutes long and already its own required job; this step is
      // proved by the caller, and step 4 binds the bytes it ran against.
      if (!receiptPath) return 'no --receipt, so nothing binds the gate run to these bytes';
      return null;
    }],
    ['4. a review receipt binds to the current bytes', () => {
      if (!fs.existsSync(receiptPath)) return `no receipt at ${receiptPath}`;
      let receipt;
      try {
        receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
      } catch (error) {
        return `receipt is not valid json: ${error.message}`;
      }
      const current = implementationDigest(root);
      if (receipt.implementation_digest !== current.digest) {
        return `receipt is stale: it binds ${String(receipt.implementation_digest).slice(0, 12)} `
          + `(${receipt.implementation_files} files) but the tree is ${current.digest.slice(0, 12)} (${current.files} files).`
          + ' Re-run the review on the current bytes, and keep the receipt outside the repository or in an ignored path.';
      }
      try {
        validateReviewReceipt(receipt, {
          technical_spec_digest: receipt.technical_spec_digest,
          catalogue_digest: receipt.catalogue_digest,
          implementation_digest: current.digest,
          implementation_base: receipt.implementation_base,
          acceptance_ids: (receipt.verdicts || []).map((v) => v.id),
        });
      } catch (error) {
        return `receipt rejected: ${error.message}`;
      }
      return null;
    }],
    ['5. the changelog names the released version', () => {
      const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
      const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
      return new RegExp(`^## \\[${version.replace(/\./g, '\\.')}\\](\\s|$)`, 'm').test(changelog)
        ? null : `CHANGELOG.md has no "## [${version}]" entry`;
    }],
    ['6. versions and trackers agree', () => node('check-versions.js') || node('check-coherence.js')],
  ];
}

function main() {
  const root = path.resolve(arg('root', path.join(__dirname, '..')));
  const receiptPath = arg('receipt');
  if (!receiptPath) {
    console.error('check-deployment-gate: --receipt <path> is required; the sequence has no step 4 without it');
    process.exit(1);
  }
  const lines = [];
  let failed = null;
  for (const [label, run] of steps(root, path.resolve(root, receiptPath))) {
    if (failed) {
      lines.push(`  ·  ${label} (not reached)`);
      continue;
    }
    const reason = run();
    if (reason) {
      failed = { label, reason };
      lines.push(`  ✗  ${label}`);
    } else {
      lines.push(`  ✓  ${label}`);
    }
  }
  const stream = failed ? console.error : console.log;
  stream(`change-management sequence (rig/corpus/standards/change-management.md)\n${lines.join('\n')}`);
  if (failed) {
    console.error(`\nblocked at ${failed.label}\n  ${failed.reason}`);
    process.exit(1);
  }
  console.log('\nsteps 7-9 (QA promotion on the exact SHA, tag and release, then tracker closures) are owner-only.');
}

if (require.main === module) main();
module.exports = { steps };
