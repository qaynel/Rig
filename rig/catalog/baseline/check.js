#!/usr/bin/env node
// Target-repo CI/git floor — contract + skeleton (impl-design §7.5, §8).
// Materialized to `.rig/bin/check.js`. Phase 2 lands the argv contract and
// dependency-ordered dispatch shape; Phase 3 / Slice 7 fills baseline + binding
// execution. Invoked as: `node .rig/bin/check.js --scope <diff|repo> [--service <id>]`
'use strict';

const fs = require('node:fs');
const path = require('node:path');
// runArgv/runBinding are the canonical implementation, shared with the
// interactive `rig check` command (rig/lib/checks.js) — see GA-38. This file
// must not carry its own copy of that logic: a hand-duplicated copy is
// exactly the defect RIG-144 found (a containment fix landed in one copy and
// silently missed the other). `apply.js` materializes `check-runner.js`
// alongside this file's other `../lib/*` requires so the installed
// `.rig/bin/check.js` resolves the same module.
const { runArgv, runBinding } = require('../lib/check-runner');

function parseArgs(argv) {
  const args = { scope: 'repo', service: null };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--scope') args.scope = argv[++i];
    else if (argv[i] === '--service') args.service = argv[++i];
    else throw new Error(`rig check: unknown argument "${argv[i]}"`);
  }
  if (!['diff', 'repo'].includes(args.scope)) {
    throw new Error('rig check: --scope must be diff or repo');
  }
  return args;
}

function loadJson(rel) {
  const file = path.join(__dirname, '..', '..', rel);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const repoRoot = path.resolve(__dirname, '..', '..');

  // Baseline checks (always): exact-copy sync, then secret floor availability.
  const copyCheck = path.join(__dirname, 'check-copies.js');
  if (fs.existsSync(copyCheck)) {
    const copy = runArgv(process.execPath, [copyCheck], repoRoot);
    if (copy.status !== 0) {
      process.stderr.write(copy.stderr || copy.stdout || 'check-copies failed\n');
      process.exit(copy.status || 1);
    }
  }

  // Selected executable bindings in dependency order (filled by apply).
  const bindings = loadJson('.rig/service-bindings.json') || {};
  const order = (loadJson('.rig/catalog-receipt.json') || {}).order || Object.keys(bindings);
  const selected = args.service ? [args.service] : order;

  for (const serviceId of selected) {
    const binding = bindings[serviceId];
    if (!binding) {
      process.stderr.write(`${serviceId}: coverage gap: binding is missing\n`);
      process.exit(1);
    }
    const result = runBinding(serviceId, binding, args.scope, repoRoot);
    if (result.error || result.status !== 0) {
      const message = result.reason || result.stderr || result.stdout || `${serviceId} failed`;
      process.stderr.write(message.endsWith('\n') ? message : `${message}\n`);
      process.exit(result.status || 1);
    }
  }
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

module.exports = { parseArgs, runArgv, runBinding };
