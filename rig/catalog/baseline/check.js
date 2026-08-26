#!/usr/bin/env node
// Target-repo CI/git floor — contract + skeleton (impl-design §7.5, §8).
// Materialized to `.rig/bin/check.js`. Phase 2 lands the argv contract and
// dependency-ordered dispatch shape; Phase 3 / Slice 7 fills baseline + binding
// execution. Invoked as: `node .rig/bin/check.js --scope <diff|repo> [--service <id>]`
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnGuardedSync } = require('../lib/spawn-guarded');
// spawnSync-shaped results are preserved for the installed checker contract.

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

function runArgv(command, argv, cwd) {
  return spawnGuardedSync(command, argv, {
    cwd,
    encoding: 'utf8',
    shell: false,
    timeout: 10 * 60 * 1000,
  });
}

function runBinding(serviceId, binding, scope, repoRoot) {
  const checks = binding.checks && Object.entries(binding.checks);
  if (!checks) {
    const argv = binding[scope] || binding.repo;
    if (!argv || !Array.isArray(argv) || argv.length === 0) {
      return { status: 1, message: `${serviceId}: missing ${scope} binding\n` };
    }
    const [command, ...rest] = argv;
    return runArgv(command, rest, repoRoot);
  }

  for (const [checkId, check] of checks) {
    if (check.coverage_gap) {
      return { status: 1, message: `${checkId}: coverage gap: ${check.coverage_gap}\n` };
    }
    for (const rel of check.required_paths || []) {
      const abs = typeof rel === 'string' ? path.resolve(repoRoot, rel) : '';
      if (!abs || (!abs.startsWith(repoRoot + path.sep) && abs !== repoRoot)) {
        return { status: 1, message: `${checkId}: required installed path is invalid\n` };
      }
      if (!fs.existsSync(abs)) {
        return { status: 1, message: `${checkId}: required installed path is missing: ${rel}\n` };
      }
    }
    if (check.fix && (!Array.isArray(check.fix) || check.fix.length === 0)) {
      return { status: 1, message: `${checkId}: explicit fix binding is malformed\n` };
    }
    if (check.commands) {
      for (const commandBinding of check.commands) {
        if (!Array.isArray(commandBinding.argv) || commandBinding.argv.length === 0) {
          return { status: 1, message: `${checkId}: component command is malformed\n` };
        }
        const cwd = path.resolve(repoRoot, commandBinding.cwd || '.');
        if (cwd !== repoRoot && !cwd.startsWith(repoRoot + path.sep)) {
          return { status: 1, message: `${checkId}: component cwd escapes repository\n` };
        }
        const [command, ...rest] = commandBinding.argv;
        const result = runArgv(command, rest, cwd);
        if (result.error || result.status !== 0) return result;
      }
      continue;
    }
    const argv = check[scope] || check.repo;
    if (!argv) continue;
    if (!Array.isArray(argv) || argv.length === 0) {
      return { status: 1, message: `${checkId}: ${scope} binding is malformed\n` };
    }
    const [command, ...rest] = argv;
    const result = runArgv(command, rest, repoRoot);
    if (result.error || result.status !== 0) return result;
  }
  return { status: 0, stdout: '', stderr: '' };
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
      process.stderr.write(result.message || result.stderr || result.stdout || `${serviceId} failed\n`);
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
