'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const test = require('node:test');

const { traces } = require('../scripts/build-wiki-index');
const { lintFindings } = require('../scripts/wiki-maintenance');

const repoRoot = path.join(__dirname, '..');

test('wiki-maintenance lint is clean on the current branch', () => {
  const findings = lintFindings(repoRoot, traces(repoRoot));
  assert.deepEqual(findings, [], findings.join('\n'));
});
