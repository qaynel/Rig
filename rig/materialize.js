#!/usr/bin/env node
// Tier 2 install seam: Basic legacy path + Advanced subcommand delegation.
// Domain logic stays under rig/lib/. Legacy no-subcommand path unchanged.
const fs = require('node:fs');
const { loadUserConfig, validate } = require('./lib/config');
const { runPayload } = require('./lib/payload');
const { renderMcp } = require('./lib/renderers');
const { writeCredentialOutputs } = require('./lib/credentials');
const { installGuard } = require('./lib/guard');
const { writeReceipt } = require('./lib/receipt');
const { uninstall } = require('./lib/uninstall');
const { assignVariants } = require('./lib/variants');
const { ADVANCED, runAdvanced } = require('./lib/cli-advanced');

function parseArgs(argv) {
  const args = { target: null, manifest: null, uninstall: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--target') args.target = argv[++i];
    else if (argv[i] === '--manifest') args.manifest = argv[++i];
    else if (argv[i] === '--uninstall') args.uninstall = true;
    else throw new Error(`rig: unknown argument "${argv[i]}"`);
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv.length && ADVANCED.has(argv[0])) {
    runAdvanced(argv[0], argv.slice(1));
    return;
  }
  const args = parseArgs(argv);
  if (!args.target || !fs.existsSync(args.target)) {
    throw new Error('rig: --target <dir> is required and must exist');
  }
  if (args.uninstall) {
    const result = uninstall(args.target) || { best_effort: [] };
    if ((result.best_effort || []).length) {
      console.error(`rig: uninstall best effort; retained: ${result.best_effort.join(', ')}`);
      process.exitCode = 1;
    }
    return;
  }
  if (!args.manifest) throw new Error('rig: --manifest <config.json> is required');
  const config = loadUserConfig(args.manifest);
  validate(config);
  runPayload(args.target, config.hosts);
  if (config.mcp_servers.length > 0) {
    const receipt = renderMcp(args.target, config);
    writeCredentialOutputs(args.target, config, receipt);
    receipt.chainedBackup = installGuard(args.target).chainedBackup;
    writeReceipt(args.target, receipt);
  }
}

module.exports = { assignVariants };

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}
