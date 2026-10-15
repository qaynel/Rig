'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const { trackerFailures, doctrineFailures, docFailures } = require('../scripts/check-coherence');

const row = { id: 'RIG-101', ticket: 'RIG-101.md', state: 'open', issue: 10,
  github_from: { state: 'OPEN', stateReason: null }, github_to: { state: 'OPEN', stateReason: null } };
const board = '- [ ] **RIG-101 — work**\n  **Delivery state (RIG-101):** open\n';
const tickets = new Map([['RIG-101.md', '**Delivery state (RIG-101):** open\n']]);

test('coherence rejects board, ticket and unmapped live tracker drift', () => {
  const live = [{ number: 10, title: 'RIG-101 work', state: 'OPEN', stateReason: null, labels: [] }];
  assert.deepEqual(trackerFailures([row], board, tickets, live, 'candidate'), []);
  assert.match(trackerFailures([row], board.replace(':** open', ':** delivered'), tickets, live, 'candidate').join('\n'), /board/);
  assert.match(trackerFailures([row], board, new Map([['RIG-101.md', 'missing']]), live, 'candidate').join('\n'), /ticket/);
  assert.match(trackerFailures([row], board, tickets, [...live, { number: 11, title: 'RIG-999 new', state: 'OPEN' }], 'candidate').join('\n'), /unmapped/);
  assert.match(trackerFailures([row], board, tickets, [{ ...live[0], state: 'CLOSED' }], 'candidate').join('\n'), /GitHub/);
});

test('coherence distinguishes redesign, candidate fixes and delivered GitHub outcomes', () => {
  const redesign = { ...row, state: 'redesign', github_to: { state: 'CLOSED', stateReason: 'NOT_PLANNED' } };
  const b = board.replace(':** open', ':** redesign');
  const t = new Map([['RIG-101.md', tickets.get('RIG-101.md').replace(':** open', ':** redesign')]]);
  const live = [{ number: 10, title: 'RIG-101 work', state: 'CLOSED', stateReason: 'NOT_PLANNED', labels: [{ name: 'redesign' }] }];
  assert.deepEqual(trackerFailures([redesign], b, t, live, 'delivered'), []);
  assert.match(trackerFailures([redesign], b, t, [{ ...live[0], stateReason: 'COMPLETED' }], 'delivered').join('\n'), /GitHub/);
  assert.match(trackerFailures([redesign], b, t, [{ ...live[0], labels: [] }], 'delivered').join('\n'), /redesign label/);
});

test('coherence accepts retirement and historical quotations but rejects active retired doctrine', () => {
  assert.deepEqual(doctrineFailures('The markdown-only rule is retired.\n> Historical: Tier 1 must remain markdown-only.\n'), []);
  assert.match(doctrineFailures('Tier 1 must remain markdown-only.').join('\n'), /retired/);
  assert.match(doctrineFailures('Never ship scripts or MCP.').join('\n'), /retired/);
});

test('coherence checks current versions and documented commands against actual CLI help', () => {
  const help = 'Usage: rig inspect|uninstall [--target path]\n';
  assert.deepEqual(docFailures('# Rig 6.0.0\nHistorical v5.0.0 upgrades supported.\n```sh\n.rig/bin/rig inspect --target repo\n```', '6.0.0', help), []);
  assert.match(docFailures('# Rig 5.0.0', '6.0.0', help).join('\n'), /version/);
  assert.match(docFailures('```sh\n.rig/bin/rig invented --bogus repo\n```', '6.0.0', help).join('\n'), /invented|bogus/);
});

test('repository check runs coherence and executed-test evidence gates', () => {
  const result = spawnSync(process.execPath, ['scripts/check-coherence.js'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout);
});
