#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');

test('RIG-119 folds spec-driven requests into grilling and product design', () => {
  const router = read('rig/tier-1/routing.md');
  const grilling = read('rig/tier-1/skills/grilling/SKILL.md');
  const productDesign = read('rig/tier-1/skills/product-design/SKILL.md');

  assert.match(router, /spec-driven requests[^\n]+rig-grilling[^\n]+rig-product-design/i);
  assert.match(router, /\| `rig-grilling` \|[^\n]+spec(?:ification|-driven)/i);
  assert.doesNotMatch(router, /\| `rig-spec` \|/);
  assert.match(grilling, /five checkpoints:[\s\S]*Why[\s\S]*Scope[\s\S]*Technical interrogation[\s\S]*Draft review[\s\S]*Gate/);
  assert.match(productDesign, /technical-interrogation checkpoint of\s+the folded spec-driven flow/i);

  for (const host of ['.claude', '.agents']) {
    assert.equal(read(`${host}/skills/rig-grilling/SKILL.md`), grilling);
    assert.equal(read(`${host}/skills/rig-product-design/SKILL.md`), productDesign);
  }
});
