#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const readme = fs.readFileSync(path.join(__dirname, '..', '..', '..', '..', '..', 'rig/corpus/onboarding/README.md'), 'utf8');

test('onboarding explains when to offer a service and how to graft it', () => {
  assert.match(readme, /When to offer a catalogue service/i);
  assert.match(readme, /identity\.md[\s\S]*Offer[\s\S]*applicability/i);
  assert.match(readme, /coverage ceiling/i);
  assert.match(readme, /minimal grade[\s\S]*higher grade/i);
  assert.match(readme, /Graft a selected service/i);
  assert.match(readme, /existing instruction file[\s\S]*marked section/i);
});
