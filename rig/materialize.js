#!/usr/bin/env node
// Install seam: Basic legacy path + Advanced subcommand delegation.
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
    else if (argv[i] === '--purge') args.purge = true;
    else if (argv[i] === '--purge-generated') args.purgeGenerated = true;
    else throw new Error(`rig: unknown argument "${argv[i]}"`);
  }
  return args;
}

function main() {
  const argv = process.argv.slice(2);
  if (argv[0] === '--help' || argv[0] === 'help') {
    console.log(`Rig commands: ${[...ADVANCED, 'lint-setup'].join(', ')}
Legacy install: --target <repo> --manifest <config.json>; removal: --target <repo> --uninstall [--purge | --purge-generated]
Command flags: --target --input --out --hosts --host --manifest --review --plan --approval --menu --service --inspection --dry-run --purge --purge-generated --policy --proposal --action
Lint setup: lint-setup --input <request.json>; request action=propose or apply, target, proposal and separate approval.`);
    return;
  }
  if (argv[0] === 'lint-setup') {
    if (argv.length !== 3 || argv[1] !== '--input') throw new Error('rig: lint-setup requires --input <request.json>');
    const request = JSON.parse(fs.readFileSync(argv[2], 'utf8'));
    const { proposeSetup, applySetup } = require('./lib/lint-format');
    if (request.action !== 'propose' && request.action !== 'apply') throw new Error('rig: lint-setup action must be propose or apply');
    const result = request.action === 'propose' ? proposeSetup(request) : applySetup(request.target, request.proposal, request.approval);
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (argv.length && ADVANCED.has(argv[0])) {
    runAdvanced(argv[0], argv.slice(1));
    return;
  }
  const args = parseArgs(argv);
  if (!args.target || !fs.existsSync(args.target)) {
    throw new Error('rig: --target <dir> is required and must exist');
  }
  if (args.uninstall) {
    const result = uninstall(args.target, { purge: args.purge === true, purgeGenerated: args.purgeGenerated === true }) || { best_effort: [] };
    if ((result.best_effort || []).length) {
      const retained = (result.best_effort_details || []).length
        ? result.best_effort_details
        : result.best_effort;
      console.error(`rig: uninstall best effort; retained: ${retained.join(', ')}`);
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
