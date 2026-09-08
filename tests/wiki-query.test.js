'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { HARD_CAP, parse, query, render } = require('../scripts/wiki-query');

function fixture(count, overrides = () => ({})) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-wiki-query-'));
  fs.mkdirSync(path.join(root, 'wiki', 'reasoning'), { recursive: true });
  for (let i = 1; i <= count; i += 1) {
    const day = String(i).padStart(2, '0');
    const fields = { topics: 'safety', tags: 'trap', status: 'historical', decisions: 'D1', ...overrides(i) };
    fs.writeFileSync(
      path.join(root, 'wiki', 'reasoning', `2026-01-${day}-trace-${i}.md`),
      `---\ndate: 2026-01-${day}\nsource: agent\ntopics: ${fields.topics}\ndecisions: ${fields.decisions}\nstatus: ${fields.status}\nsupersedes:\ntags: ${fields.tags}\nsummary: Trace number ${i}.\n---\n# Trace ${i}\n`,
    );
  }
  return root;
}

test('results are capped and the caller is told how many were withheld', () => {
  const result = query(fixture(30), { limit: 5 });
  assert.equal(result.rows.length, 5);
  assert.equal(result.total, 30);
  assert.match(render(result), /25 more match/);
});

test('the hard cap cannot be raised past HARD_CAP by --limit', () => {
  const result = query(fixture(80), { limit: 500 });
  assert.equal(result.rows.length, HARD_CAP);
});

test('filters compose and narrow the result', () => {
  const root = fixture(10, (i) => ({ topics: i % 2 ? 'safety' : 'signing', status: i === 3 ? 'current' : 'historical' }));
  assert.equal(query(root, { topic: 'signing' }).total, 5);
  assert.equal(query(root, { topic: 'safety', status: 'current' }).total, 1);
  assert.equal(query(root, { since: '2026-01-08' }).total, 3);
  assert.equal(query(root, { text: 'number 7' }).total, 1);
});

test('a query that matches nothing returns an empty result and says so', () => {
  const result = query(fixture(5), { topic: 'nonsense' });
  assert.equal(result.total, 0);
  assert.match(render(result), /no traces match/i);
});

test('newest results come first', () => {
  const [first] = query(fixture(5), {}).rows;
  assert.equal(first.date, '2026-01-05');
});

test('parse rejects a flag with no value instead of silently ignoring it', () => {
  assert.throws(() => parse(['--topic']), /--topic needs a value/);
  assert.throws(() => parse(['topic', 'safety']), /unknown argument: topic/);
});
