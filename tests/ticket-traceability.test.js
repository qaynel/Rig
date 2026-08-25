#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.join(__dirname, '..');
const checker = path.join(root, 'scripts', 'check-ticket-traceability.js');

function withFixture(fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-ticket-traceability-'));
  try {
    const tickets = path.join(dir, 'tickets');
    fs.mkdirSync(tickets);
    const board = path.join(dir, 'Tickets.md');
    const testFile = path.join(dir, 'evidence.test.js');
    fs.writeFileSync(testFile, "test('evidence exists', () => {});\n");
    fs.writeFileSync(board, '## Done\n\n- [x] Card · [Solution](tickets/RIG-1.md)\n');
    return fn({ board, tickets, testFile });
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

function run({ board, tickets }) {
  return spawnSync(process.execPath, [checker, '--board', board, '--tickets', tickets], {
    encoding: 'utf8',
  });
}

test('traceability checker runs from npm test', () => {
  assert.ok(fs.existsSync(checker), 'add the traceability checker before marking cards complete');
  const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
  const script = pkg.scripts['test:code'];
  // Prefer an indirect wire through check-versions.js so package.json stays on
  // the signed Gate 1 oracle snapshot (RIG-131 / RIG-134).
  const versions = fs.readFileSync(path.join(root, 'scripts', 'check-versions.js'), 'utf8');
  const wiredDirect = script.includes('scripts/check-ticket-traceability.js');
  const wiredViaVersions = script.includes('scripts/check-versions.js')
    && versions.includes('check-ticket-traceability.js');
  assert.ok(wiredDirect || wiredViaVersions, 'wire the checker into npm test before the Node glob');
  const nodeTestsAt = script.search(/node --test tests\//);
  assert.notEqual(nodeTestsAt, -1, 'npm test must still run the Node test glob');
  if (wiredDirect) {
    const checkerAt = script.indexOf('scripts/check-ticket-traceability.js');
    assert.ok(checkerAt < nodeTestsAt, 'the checker must run before the Node test glob');
  } else {
    const versionsAt = script.indexOf('scripts/check-versions.js');
    assert.ok(versionsAt < nodeTestsAt, 'check-versions (and thus the checker) must run before the Node test glob');
  }
  const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});

test('a completed card without an evidence reference fails', () => {
  if (!fs.existsSync(checker)) return;
  return withFixture((fixture) => {
    fs.writeFileSync(path.join(fixture.tickets, 'RIG-1.md'), '## Acceptance\n\n- behavior works\n');
    const result = run(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /RIG-1.*evidence|evidence.*RIG-1/i);
  });
});

test('a missing file or missing named test fails', () => {
  if (!fs.existsSync(checker)) return;
  return withFixture((fixture) => {
    fs.writeFileSync(path.join(fixture.tickets, 'RIG-1.md'), [
      '## Acceptance',
      '',
      '- missing file → tests/missing.test.js::test exists',
      '- missing title → tests/evidence.test.js::renamed test',
      '',
    ].join('\n'));
    const result = run(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /missing\.test\.js/);
    assert.match(result.stderr + result.stdout, /renamed test/);
  });
});

test('the checker rejects a stale test title', () => {
  if (!fs.existsSync(checker)) return;
  return withFixture((fixture) => {
    fs.writeFileSync(path.join(fixture.tickets, 'RIG-1.md'), '## Acceptance\n\n- behavior → tests/evidence.test.js::old title\n');
    const result = run(fixture);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr + result.stdout, /old title/);
  });
});

test('manual evidence is counted and reported', () => {
  if (!fs.existsSync(checker)) return;
  return withFixture((fixture) => {
    fs.writeFileSync(path.join(fixture.tickets, 'RIG-1.md'), [
      '## Acceptance',
      '',
      '- behavior → tests/evidence.test.js::evidence exists',
      '- hardware boundary → manual: requires a real external device',
      '',
    ].join('\n'));
    const result = run(fixture);
    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.match(result.stdout, /manual evidence:\s*1/i);
  });
});

test('the current board has no unresolved completed-card violation', () => {
  assert.ok(fs.existsSync(checker), 'add the traceability checker before marking cards complete');
  const result = spawnSync(process.execPath, [checker], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
