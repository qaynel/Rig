#!/usr/bin/env node
'use strict';

// Repo entrypoint for the shipped traceability invariant. The implementation
// lives in the mandatory installed baseline so every default install runs the
// same bytes.
module.exports = require('../rig/catalog/baseline/check-traceability.js');

if (require.main === module) process.exit(module.exports.main(process.argv.slice(2)));
