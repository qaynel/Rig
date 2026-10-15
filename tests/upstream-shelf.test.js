'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const zlib = require('node:zlib');
const { sha256, fetchUpstream } = require('../rig/lib/upstream-fetch');
const { runPayload } = require('../rig/lib/payload');
const root = path.resolve(__dirname, '..');

test('bootstrap stages pinned metadata and core, with optional third-party resources fetched at onboarding', () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-fetch-delivery-'));
  try {
    runPayload(target, ['codex'], { activeDelivery: true });
    assert.equal(fs.existsSync(path.join(target, '.rig/runtime/rig/catalog/skills/testing/web-quality-assurance/qa/SKILL.md')), false);
    assert.equal(fs.existsSync(path.join(target, '.rig/plumbing/bin/rig-diff-scope')), false);
    assert.ok(fs.existsSync(path.join(target, '.rig/upstream/gstack-shelf.json')));
    assert.ok(fs.existsSync(path.join(target, '.agents/skills/rig-grilling/SKILL.md')));
  } finally { fs.rmSync(target, { recursive: true, force: true }); }
});

test('pinned full shelf fetch reproduces all 55 optional skills and shared runtime without trusting a vendored fallback', async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-shelf-meta-'));
  try {
    fs.cpSync(path.join(root, 'rig/corpus/upstream'), dir, { recursive: true });
    const bytes = fs.readFileSync(path.join(__dirname, 'fixtures/upstream/shelf.tar.gz'));
    const file = path.join(dir, 'gstack-shelf.json');
    const meta = JSON.parse(fs.readFileSync(file));
    meta.archive.tar_sha256 = sha256(zlib.gunzipSync(bytes));
    fs.writeFileSync(file, JSON.stringify(meta));
    const result = await fetchUpstream('gstack-shelf', { metaDir: dir, licencePath: path.join(root, 'rig/catalog/skills/LICENSE.upstream'), fetcher: async () => bytes });
    assert.equal(result.status, 'ok', JSON.stringify(result.gaps));
    assert.equal([...result.files.keys()].filter((name) => name.endsWith('/SKILL.md')).length, 55);
    for (const [output, fetched] of result.files) {
      const source = output.startsWith('plumbing/') ? 'rig/catalog/' + output : 'rig/catalog/skills/' + output;
      assert.ok(fetched.equals(fs.readFileSync(path.join(root, source))), output);
    }
    assert.ok(result.receipt.patches.some((patch) => patch.id === 'rig-shelf-overlay'));
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});
