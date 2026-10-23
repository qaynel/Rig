'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const { uninstall, parseJournalRecords } = require('../rig/lib/lifecycle');
const { journalWriter } = require('../rig/lib/payload');

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function withTarget(run) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-review-journal-'));
  try { return run(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

function fileBytes(root) {
  const rows = [];
  const walk = (dir, prefix = '') => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = path.join(prefix, entry.name).split(path.sep).join('/');
      const abs = path.join(dir, entry.name);
      const stat = fs.lstatSync(abs);
      if (stat.isSymbolicLink()) rows.push([rel, `link:${fs.readlinkSync(abs)}`]);
      else if (stat.isDirectory()) walk(abs, rel);
      else rows.push([rel, fs.readFileSync(abs).toString('hex')]);
    }
  };
  walk(root);
  return rows.sort(([a], [b]) => a.localeCompare(b));
}

test('public uninstall refuses incomplete or malformed journal history before changing any bytes', () => {
  const data = Buffer.from('{"user":"keep me"}\n');
  const digest = sha256(data);
  const complete = { kind: 'install_state', complete: true };
  const validBase = {
    seq: 1,
    path: '.rig/user-data.json',
    ownership: 'create_owned',
    operation: 'create_owned',
    transaction_kind: 'install',
    state: 'applied',
    preimage_digest: null,
    desired_digest: digest,
    digest,
  };
  const malformed = [
    ['missing ownership', ({ ownership: _ownership, ...row }) => row],
    ['missing state', ({ state: _state, ...row }) => row],
    ['missing operation', ({ operation: _operation, ...row }) => row],
    ['missing applied digest', ({ digest: _digest, ...row }) => row],
    ['invalid pending desired digest', (row) => ({ ...row, state: 'pending', digest: undefined, desired_digest: 'not-a-sha256' })],
  ];

  for (const [label, alter] of malformed) withTarget((target) => {
    const userFile = path.join(target, '.rig/user-data.json');
    const journal = path.join(target, '.rig/install-manifest.jsonl');
    fs.mkdirSync(path.dirname(userFile), { recursive: true });
    fs.writeFileSync(userFile, data);
    fs.writeFileSync(journal, `${JSON.stringify(complete)}\n${JSON.stringify(alter(validBase))}\n`);
    const before = fileBytes(target);
    assert.throws(() => uninstall(target), /manifest record is invalid/, label);
    assert.deepEqual(fileBytes(target), before, `${label}: uninstall must preserve every file byte`);
  });

  withTarget((target) => {
    const userFile = path.join(target, '.rig/user-data.json');
    const journal = path.join(target, '.rig/install-manifest.jsonl');
    fs.mkdirSync(path.dirname(userFile), { recursive: true });
    fs.writeFileSync(userFile, data);
    fs.writeFileSync(journal, [
      JSON.stringify({ kind: 'install_state', complete: false }),
      JSON.stringify({ ...validBase, state: 'pending' }),
      JSON.stringify({ ...validBase, desired_digest: sha256('contradiction\n'), digest: sha256('contradiction\n') }),
    ].join('\n') + '\n');
    const before = fileBytes(target);
    assert.throws(() => uninstall(target), /manifest record is invalid/,
      'contradictory later history must be refused before teardown');
    assert.deepEqual(fileBytes(target), before);
  });
});

test('shared parser accepts complete records emitted for every legitimate journal operation', () => withTarget((target) => {
  const writer = journalWriter(target);
  writer.begin();
  writer(target, 'created.txt', 'created\n');
  fs.writeFileSync(path.join(target, 'replaced.txt'), 'original\n');
  writer(target, 'replaced.txt', 'replacement\n');
  writer(target, 'line.txt', 'managed line\n', undefined, 'append_managed', { managed_line: 'managed line' });
  writer(target, 'block.txt', '# rig:block:start\nowned\n# rig:block:end\n', undefined, 'append_managed', { managed_block: 'block' });
  writer(target, 'merged.yml', 'jobs:\n  rig: {}\n', undefined, 'merge_namespaced', { managed_regions: [sha256('region')] });
  writer(target, 'grafted.md', 'before\n<!-- rig:graft capability="one.two" version="1" begin -->\nowned\n<!-- rig:graft capability="one.two" end -->\n', undefined, 'graft_managed', { managed_grafts: [{ capability: 'one.two', digest: sha256('owned\n') }] });
  writer(target, 'seed.json', '{}\n', undefined, 'user_owned', { transaction_kind: 'user_seed' });
  writer(target, 'setup.toml', '[tool.ruff]\nline-length=88\n', undefined, 'lint_format_config', {
    setup_digest: sha256('proposal'), setup_ecosystem: 'python', setup_original_digest: null,
  });
  writer(target, 'host-adapter.md', 'host\n', undefined, 'host_adapter');
  writer.remove(target, 'created.txt', sha256('created\n'));
  writer.finish();

  assert.doesNotThrow(() => parseJournalRecords(fs.readFileSync(path.join(target, '.rig/install-manifest.jsonl'), 'utf8')));
}));

test('legacy applied create-owned records may omit a preimage digest, while replacements may not', () => {
  const digest = sha256('created by an older valid writer\n');
  const legacyCreate = {
    seq: 1, path: 'legacy-created.txt', ownership: 'create_owned', operation: 'create_owned',
    transaction_kind: 'install', state: 'applied', desired_digest: digest, digest,
  };
  assert.doesNotThrow(() => parseJournalRecords(`${JSON.stringify(legacyCreate)}\n`));
  assert.throws(() => parseJournalRecords(`${JSON.stringify({
    ...legacyCreate, ownership: 'replace_owned', operation: 'replace_owned',
  })}\n`), /preimage digest/);
});
