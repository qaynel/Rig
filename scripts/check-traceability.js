#!/usr/bin/env node
'use strict';

// Repo entrypoint for the shipped traceability invariant. The implementation
// lives in the mandatory installed baseline so every default install runs the
// same bytes.
module.exports = require('../rig/catalog/baseline/check-traceability.js');

if (require.main === module) {
  const args = process.argv.slice(2);
  const programme = args.indexOf('--programme');
  if (programme < 0) process.exit(module.exports.main(args));
  if (args[programme + 1] !== 'rebuild') throw new Error('unknown traceability programme');
  const result = require('./rebuild/check-contract').checkContract();
  console.log(args.includes('--json') ? JSON.stringify(result, null, 2)
    : result.errors.length ? result.errors.join('\n') : `rebuild traceability: ${result.counts.requirements} requirements, criteria and proving tests; owner approval pending unless recorded separately`);
  process.exit(result.errors.length ? 1 : 0);
}
