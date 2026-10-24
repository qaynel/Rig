'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');
const { journalWriter } = require('../rig/lib/payload');
const { uninstall } = require('../rig/lib/lifecycle');

const CAPABILITY = 'testing.test-driven-development';
const SECOND = 'review.code-and-pull-request';

function graftApi() {
  return {
    parse: h.api('payload.js', 'parseGraftSections'),
    upsert: h.api('payload.js', 'upsertGraftSection'),
    remove: h.api('payload.js', 'removeGraftSection'),
  };
}

function mutate(target, operation, args) {
  const writer = journalWriter(target);
  const result = operation(target, args, writer);
  writer.finish();
  return result;
}

test('AT-PB-2 create update and reapply own only a versioned graft section', async () => {
  const { parse, upsert } = graftApi();
  await h.withRepo((target) => {
    const file = path.join(target, 'AGENTS.md');
    const before = fs.readFileSync(file);
    let expected = h.sha256(before);
    const created = mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1,
      content: 'Drive one behavior through red, green, and refactor.',
      expected_file_digest: expected,
    });
    assert.deepEqual({ changed: created.changed, action: created.action }, { changed: true, action: 'create' });
    const afterCreate = fs.readFileSync(file);
    assert.ok(afterCreate.subarray(0, before.length).equals(before));
    const sections = parse(afterCreate);
    assert.equal(sections.sections.length, 1);
    assert.deepEqual(sections.sections[0], {
      capability: CAPABILITY,
      version: 1,
      start: sections.sections[0].start,
      end: sections.sections[0].end,
      content: 'Drive one behavior through red, green, and refactor.',
      content_digest: h.sha256('Drive one behavior through red, green, and refactor.'),
    });

    expected = h.sha256(afterCreate);
    const noop = mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1,
      content: 'Drive one behavior through red, green, and refactor.',
      expected_file_digest: expected,
    });
    assert.deepEqual({ changed: noop.changed, action: noop.action }, { changed: false, action: 'noop' });
    assert.deepEqual(fs.readFileSync(file), afterCreate);

    const updated = mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1,
      content: 'Preserve the approved oracle and drive one behavior at a time.',
      expected_file_digest: expected,
    });
    assert.equal(updated.action, 'update');
    assert.ok(fs.readFileSync(file).subarray(0, before.length).equals(before));
    assert.match(fs.readFileSync(file, 'utf8'), /Preserve the approved oracle/);
  });
});

test('AT-PB-2 one-of-many removal preserves surrounding bytes and the other graft', async () => {
  const { parse, upsert, remove } = graftApi();
  await h.withRepo((target) => {
    const file = path.join(target, 'AGENTS.md');
    const outside = fs.readFileSync(file);
    mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1, content: 'TDD body.',
      expected_file_digest: h.sha256(outside),
    });
    mutate(target, upsert, {
      path: 'AGENTS.md', capability: SECOND, version: 1, content: 'Review body.',
      expected_file_digest: h.sha256(fs.readFileSync(file)),
    });
    const removed = mutate(target, remove, {
      path: 'AGENTS.md', capability: CAPABILITY,
      expected_file_digest: h.sha256(fs.readFileSync(file)),
    });
    assert.equal(removed.action, 'remove');
    const after = fs.readFileSync(file);
    assert.ok(after.subarray(0, outside.length).equals(outside));
    assert.deepEqual(parse(after).sections.map(({ capability }) => capability), [SECOND]);
    assert.doesNotMatch(after.toString('utf8'), /TDD body/);
    assert.match(after.toString('utf8'), /Review body/);
  });
});

test('AT-PB-2 CRLF and no-final-newline files retain their outside byte style', async () => {
  const { upsert, remove } = graftApi();
  await h.withRepo((target) => {
    const file = path.join(target, 'AGENTS.md');
    const outside = Buffer.from('# User\r\nKeep this final byte');
    fs.writeFileSync(file, outside);
    mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1, content: 'Managed body.',
      expected_file_digest: h.sha256(outside),
    });
    const grafted = fs.readFileSync(file);
    assert.ok(grafted.subarray(0, outside.length).equals(outside));
    assert.doesNotMatch(grafted.toString('utf8').replace(/\r\n/g, ''), /\n/);
    mutate(target, remove, {
      path: 'AGENTS.md', capability: CAPABILITY,
      expected_file_digest: h.sha256(grafted),
    });
    assert.deepEqual(fs.readFileSync(file), outside);
  });
});

test('AT-PB-2 malformed ownership and stale preimages fail without changing a byte', async () => {
  const { parse, upsert } = graftApi();
  const malformed = [
    '<!-- rig:graft capability="testing.tdd" version="2" begin -->\nbody\n<!-- rig:graft capability="testing.tdd" end -->\n',
    '<!-- rig:graft capability="testing.tdd" version="1" begin -->\nbody\n<!-- rig:graft capability="testing.other" end -->\n',
    '<!-- rig:graft capability="testing.tdd" end -->\n',
    '<!-- rig:graft capability="testing.tdd" version="1" begin -->\n<!-- rig:graft capability="testing.other" version="1" begin -->\n<!-- rig:graft capability="testing.other" end -->\n<!-- rig:graft capability="testing.tdd" end -->\n',
    '<!-- rig:graft capability="testing.tdd" version="1" begin -->\none\n<!-- rig:graft capability="testing.tdd" end -->\n<!-- rig:graft capability="testing.tdd" version="1" begin -->\ntwo\n<!-- rig:graft capability="testing.tdd" end -->\n',
  ];
  for (const body of malformed) assert.throws(() => parse(Buffer.from(body)), /graft|marker|version|nested|mismatch/i);
  assert.throws(() => parse(Buffer.from([0xff, 0xfe, 0xfd])), /utf-?8|encoding|invalid/i);

  await h.withRepo((target) => {
    const file = path.join(target, 'AGENTS.md');
    const before = fs.readFileSync(file);
    assert.throws(() => mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1, content: 'Managed.',
      expected_file_digest: '0'.repeat(64),
    }), /stale|digest|preimage/i);
    assert.deepEqual(fs.readFileSync(file), before);
    assert.throws(() => mutate(target, upsert, {
      path: 'config.json', capability: CAPABILITY, version: 1, content: 'Managed.',
      expected_file_digest: null,
    }), /unsupported|markdown|file type/i);
    assert.equal(fs.existsSync(path.join(target, 'config.json')), false);
    assert.throws(() => mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1,
      content: '<!-- rig:graft capability="testing.other" end -->',
      expected_file_digest: h.sha256(before),
    }), /content|marker|graft/i);
    assert.deepEqual(fs.readFileSync(file), before);
  });
});

test('AT-PB-2 graft writes refuse symlink and hard-link ambiguity', async () => {
  const { upsert } = graftApi();
  await h.withRepo((target) => {
    const outside = path.join(target, 'outside.md');
    fs.writeFileSync(outside, 'outside\n');
    const symlink = path.join(target, 'linked.md');
    fs.symlinkSync(outside, symlink);
    assert.throws(() => mutate(target, upsert, {
      path: 'linked.md', capability: CAPABILITY, version: 1, content: 'Managed.',
      expected_file_digest: h.sha256(fs.readFileSync(outside)),
    }), /symlink|link|ambiguous/i);
    assert.equal(fs.readFileSync(outside, 'utf8'), 'outside\n');

    const hard = path.join(target, 'hard.md');
    fs.linkSync(outside, hard);
    assert.throws(() => mutate(target, upsert, {
      path: 'hard.md', capability: CAPABILITY, version: 1, content: 'Managed.',
      expected_file_digest: h.sha256(fs.readFileSync(outside)),
    }), /hard.?link|link|ambiguous/i);
    assert.equal(fs.readFileSync(outside, 'utf8'), 'outside\n');
  });
});

test('AT-PB-2 journal records every current section and uninstall removes only owned ranges', async () => {
  const { upsert } = graftApi();
  await h.withRepo((target) => {
    const file = path.join(target, 'AGENTS.md');
    const userBefore = fs.readFileSync(file, 'utf8');
    mutate(target, upsert, {
      path: 'AGENTS.md', capability: CAPABILITY, version: 1, content: 'TDD body.',
      expected_file_digest: h.sha256(fs.readFileSync(file)),
    });
    mutate(target, upsert, {
      path: 'AGENTS.md', capability: SECOND, version: 1, content: 'Review body.',
      expected_file_digest: h.sha256(fs.readFileSync(file)),
    });
    const records = fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')
      .trim().split('\n').map(JSON.parse).filter(({ path: rel, state }) => rel === 'AGENTS.md' && state === 'applied');
    assert.deepEqual(records.at(-1).managed_grafts.map(({ capability }) => capability), [SECOND, CAPABILITY].sort());

    fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('TDD body.', 'User-edited managed body.'));
    fs.appendFileSync(file, 'User edit after onboarding.\n');
    const result = uninstall(target);
    assert.equal(result.status, 'removed');
    assert.equal(fs.readFileSync(file, 'utf8'), `${userBefore}User edit after onboarding.\n`);
  });
});
