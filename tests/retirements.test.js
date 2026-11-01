'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { checkRetirements } = require('../scripts/check-retirements');

test('retirement checker reports unscheduled rows and paths left after merge', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-retirement-'));
  fs.mkdirSync(path.join(root, 'rig'), { recursive: true });
  fs.writeFileSync(path.join(root, 'rig/retirements.json'), JSON.stringify({ merged: ['S4'], rows: [
    { paths: ['rig/old.js'], replacedBy: 'new', deleteIn: 'S4', reason: 'removed' },
    { paths: ['rig/no-stage.js'], replacedBy: 'new', reason: 'missing stage' },
  ] }));
  fs.writeFileSync(path.join(root, 'rig/old.js'), 'old');
  const errors = checkRetirements(root).errors;
  assert.ok(errors.some((row) => row.startsWith('overdue: rig/old.js')));
  assert.ok(errors.some((row) => row.startsWith('overdue: row has no deleteIn')));
});

test('release mode requires owner disposition for open retirement rows', () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-retirement-release-'));
  fs.mkdirSync(path.join(root, 'rig'), { recursive: true });
  fs.writeFileSync(path.join(root, 'rig/retirements.json'), JSON.stringify({ merged: [], rows: [
    { paths: ['rig/later.js'], replacedBy: 'new', deleteIn: 'S17', reason: 'pending' },
  ] }));
  const errors = checkRetirements(root, { release: true }).errors;
  assert.ok(errors.some((row) => row.startsWith('open-row:')));
});

test('repository retirement ledger has no completed-stage leftovers', () => {
  const root = path.resolve(__dirname, '..');
  assert.deepEqual(checkRetirements(root).errors, []);
});
