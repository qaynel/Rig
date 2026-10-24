#!/usr/bin/env node
'use strict';

// Subplan 03, third-party delivery: pinned fetch during onboarding. No real
// network here: fixtures are a committed tar.gz subset of the pinned upstream
// served through an injected fetcher or a file:// mirror.

const test = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');

const { fetchUpstream, defaultFetcher } = require('../rig/lib/upstream-fetch');
const { applyPatch, PatchError } = require('../rig/lib/patch-apply');
const { readTar } = require('../rig/lib/tar-read');

const root = path.join(__dirname, '..');
const META_DIR = path.join(root, 'rig/corpus/upstream');
const LICENCE = path.join(root, 'rig/catalog/skills/LICENSE.upstream');
const FIXTURE = path.join(__dirname, 'fixtures/upstream/gstack-subset.tar.gz');
const SHELF = path.join(root, 'rig/catalog/skills');
const sha = (value) => crypto.createHash('sha256').update(value).digest('hex');
const realMeta = JSON.parse(fs.readFileSync(path.join(META_DIR, 'gstack.json'), 'utf8'));

function tarOf(entries) {
  const blocks = [];
  for (const { name, data = Buffer.alloc(0), type = '0', link = '' } of entries) {
    const header = Buffer.alloc(512);
    header.write(name, 0, 100);
    header.write('0000644\0', 100);
    header.write('0000000\0', 108);
    header.write('0000000\0', 116);
    header.write(`${data.length.toString(8).padStart(11, '0')}\0`, 124);
    header.write('00000000000\0', 136);
    header.write('        ', 148);
    header.write(type, 156);
    header.write(link, 157, 100);
    header.write('ustar\0', 257);
    header.write('00', 263);
    let sum = 0;
    for (const byte of header) sum += byte;
    header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
    blocks.push(header, data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  return Buffer.concat(blocks);
}

// A metadata directory whose pinned archive digest is the fixture's.
async function withMeta(archiveBytes, mutate, fn) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-upstream-meta-'));
  try {
    fs.cpSync(META_DIR, dir, { recursive: true });
    const meta = JSON.parse(fs.readFileSync(path.join(dir, 'gstack.json'), 'utf8'));
    meta.archive.tar_sha256 = sha(zlib.gunzipSync(archiveBytes));
    if (mutate) mutate(meta, dir);
    fs.writeFileSync(path.join(dir, 'gstack.json'), JSON.stringify(meta, null, 2));
    return await fn(dir);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

const fixtureBytes = fs.readFileSync(FIXTURE);
const serve = (bytes) => async () => bytes;

test('the pinned metadata is complete: revision, https archive, digests, licence and patch digests', () => {
  assert.match(realMeta.revision, /^[0-9a-f]{40}$/);
  assert.match(realMeta.archive.url, /^https:\/\//);
  assert.ok(realMeta.archive.url.includes(realMeta.revision), 'the URL names the pinned revision, not a branch');
  assert.match(realMeta.archive.tar_sha256, /^[0-9a-f]{64}$/);
  assert.equal(realMeta.licence.spdx, 'MIT');
  assert.equal(sha(fs.readFileSync(LICENCE)), realMeta.licence.sha256);
  for (const patch of realMeta.local_patches) {
    assert.equal(sha(fs.readFileSync(path.join(META_DIR, patch.file))), patch.sha256, patch.id);
  }
  for (const row of realMeta.files) {
    const shipped = fs.readFileSync(path.join(SHELF, row.output));
    assert.equal(sha(shipped), row.final_sha256, `${row.output}: pinned patched digest is what ships`);
  }
});

test('verified fetch applies the RIG-135 patches and reproduces the shipped runtime bytes', async () => {
  await withMeta(fixtureBytes, null, async (dir) => {
    const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(fixtureBytes) });
    assert.equal(result.status, 'ok', JSON.stringify(result.gaps));
    assert.deepEqual([...result.files.keys()].sort(), realMeta.files.map((row) => row.output).sort());
    for (const [output, bytes] of result.files) {
      assert.ok(bytes.equals(fs.readFileSync(path.join(SHELF, output))), `${output} equals the shipped, patched bytes`);
    }
    assert.match(result.files.get('browser-and-research/browser-automation/browse/src/xvfb.ts').toString(), /detached: true/);
    assert.match(result.files.get('browser-and-research/browser-automation/browse/src/browser-skill-commands.ts').toString(), /killProcessTree/);
    assert.match(result.files.get('browser-and-research/browser-automation/browse/src/cookie-import-browser.ts').toString(), /spawnTreeGuarded/);
    assert.deepEqual(result.receipt.patches.map((patch) => patch.id), ['RIG-135.2', 'RIG-135.3', 'RIG-135.1']);
    assert.equal(result.receipt.licence.sha256, realMeta.licence.sha256, 'the licence notice is recorded with the receipt');
  });
});

test('an invalid digest is a named gap and yields no files', async () => {
  await withMeta(fixtureBytes, (meta) => { meta.archive.tar_sha256 = 'f'.repeat(64); }, async (dir) => {
    const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(fixtureBytes) });
    assert.equal(result.status, 'gap');
    assert.equal(result.gaps[0].code, 'digest-mismatch');
    assert.match(result.gaps[0].guidance, /do not use/);
    assert.equal(result.files, undefined);
  });
});

test('tampered archive bytes and non-archives are digest gaps, never extracted', async () => {
  await withMeta(fixtureBytes, null, async (dir) => {
    const tampered = zlib.gunzipSync(fixtureBytes);
    tampered[2000] ^= 0xff;
    for (const bytes of [zlib.gzipSync(tampered), Buffer.from('<html>not an archive</html>')]) {
      const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(bytes) });
      assert.equal(result.gaps[0].code, 'digest-mismatch');
    }
  });
});

test('an unavailable upstream is a named gap with setup guidance', async () => {
  await withMeta(fixtureBytes, null, async (dir) => {
    const down = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: async () => { throw new Error('ENOTFOUND codeload.github.com'); } });
    assert.equal(down.status, 'gap');
    assert.equal(down.gaps[0].code, 'upstream-unavailable');
    assert.match(down.gaps[0].detail, /ENOTFOUND/);
    assert.match(down.gaps[0].guidance, /RIG_UPSTREAM_MIRROR_/);
    const missing = await fetchUpstream('gstack', {
      metaDir: dir, licencePath: LICENCE, env: { RIG_UPSTREAM_MIRROR_GSTACK: 'file:///definitely/not/here.tar.gz' }, fetcher: defaultFetcher,
    });
    assert.equal(missing.gaps[0].code, 'upstream-unavailable');
    await assert.rejects(() => defaultFetcher('http://example.invalid/x.tgz'), /https or file only/);
  });
});

test('a file:// mirror works and is still digest-verified', async () => {
  await withMeta(fixtureBytes, null, async (dir) => {
    const env = { RIG_UPSTREAM_MIRROR_GSTACK: `file://${FIXTURE}` };
    const ok = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, env, fetcher: defaultFetcher });
    assert.equal(ok.status, 'ok');
    const bad = path.join(dir, 'evil.tgz');
    fs.writeFileSync(bad, zlib.gzipSync(tarOf([{ name: 'gstack-x/browse/src/xvfb.ts', data: Buffer.from('evil') }])));
    const refused = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, env: { RIG_UPSTREAM_MIRROR_GSTACK: `file://${bad}` }, fetcher: defaultFetcher });
    assert.equal(refused.gaps[0].code, 'digest-mismatch');
  });
});

test('licence retention: a missing or altered notice stops the fetch before any download', async () => {
  await withMeta(fixtureBytes, null, async (dir) => {
    let downloads = 0;
    const fetcher = async () => { downloads += 1; return fixtureBytes; };
    const absent = await fetchUpstream('gstack', { metaDir: dir, licencePath: path.join(dir, 'nope'), fetcher });
    assert.equal(absent.gaps[0].code, 'licence-missing');
    const altered = path.join(dir, 'LICENSE.altered');
    fs.writeFileSync(altered, 'MIT but shorter\n');
    assert.equal((await fetchUpstream('gstack', { metaDir: dir, licencePath: altered, fetcher })).gaps[0].code, 'licence-missing');
    assert.equal(downloads, 0);
  });
});

test('a pinned file that drifted upstream, or a tampered patch, is refused', async () => {
  const entries = readTar(zlib.gunzipSync(fixtureBytes));
  const drifted = new Map(entries);
  drifted.set('browse/src/xvfb.ts', Buffer.from(`${entries.get('browse/src/xvfb.ts')}\n// drift\n`));
  const drift = zlib.gzipSync(tarOf([...drifted].map(([name, data]) => ({ name: `gstack-x/${name}`, data }))));
  await withMeta(drift, null, async (dir) => {
    const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(drift) });
    assert.equal(result.gaps[0].code, 'patch-base-mismatch');
  });
  await withMeta(fixtureBytes, null, async (dir) => {
    fs.appendFileSync(path.join(dir, 'patches/135.3-xvfb.patch'), ' \n');
    const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(fixtureBytes) });
    assert.equal(result.gaps[0].code, 'patch-tampered');
  });
  await withMeta(fixtureBytes, (meta) => { meta.files[1].final_sha256 = '0'.repeat(64); }, async (dir) => {
    const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(fixtureBytes) });
    assert.equal(result.gaps[0].code, 'patch-result-mismatch');
  });
});

test('archives with links, device files or escaping paths are refused even when the digest matches', async () => {
  const cases = [
    [{ name: 'gstack-x/link', type: '2', link: '/etc/passwd' }, /symlink/],
    [{ name: 'gstack-x/hard', type: '1', link: 'gstack-x/a' }, /hard link/],
    [{ name: 'gstack-x/dev', type: '3' }, /special file/],
    [{ name: 'gstack-x/../../escape', data: Buffer.from('x') }, /unsafe archive path/],
    [{ name: '/abs/path', data: Buffer.from('x') }, /unsafe archive path/],
  ];
  for (const [entry, pattern] of cases) {
    const bytes = zlib.gzipSync(tarOf([entry]));
    await withMeta(bytes, null, async (dir) => {
      const result = await fetchUpstream('gstack', { metaDir: dir, licencePath: LICENCE, fetcher: serve(bytes) });
      assert.equal(result.gaps[0].code, 'archive-invalid');
      assert.match(result.gaps[0].detail, pattern);
    });
  }
});

test('the patch applier is exact: moved hunks apply, changed content and missing files do not', () => {
  const src = new Map([['a.txt', Buffer.from('one\ntwo\nthree\nfour\n')]]);
  const patch = 'diff --git a/a.txt b/a.txt\n--- a/a.txt\n+++ b/a.txt\n@@ -3,2 +3,2 @@\n three\n-four\n+FOUR\n';
  assert.equal(applyPatch(src, patch).get('a.txt').toString(), 'one\ntwo\nthree\nFOUR\n');
  const shifted = new Map([['a.txt', Buffer.from('zero\nzero2\none\ntwo\nthree\nfour\n')]]);
  assert.equal(applyPatch(shifted, patch).get('a.txt').toString(), 'zero\nzero2\none\ntwo\nthree\nFOUR\n');
  assert.throws(() => applyPatch(new Map([['a.txt', Buffer.from('one\ntwo\nthree\nchanged\n')]]), patch), PatchError);
  assert.throws(() => applyPatch(new Map(), patch), /not present/);
  const created = 'diff --git a/n.txt b/n.txt\nnew file mode 100644\n--- /dev/null\n+++ b/n.txt\n@@ -0,0 +1,2 @@\n+x\n+y\n';
  assert.equal(applyPatch(new Map(), created).get('n.txt').toString(), 'x\ny\n');
  assert.throws(() => applyPatch(src, 'diff --git a/a.txt b/a.txt\ndeleted file mode 100644\n'), /unsupported/);
});

test('the unfetched tree stays untouched: staging is removed and no file is written under the shelf', async () => {
  // A private staging root. os.tmpdir() is shared with every other test file
  // node --test runs in parallel, so a snapshot of it reports their staging
  // directories as this fetch's leak.
  const stagingRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-staging-probe-'));
  await withMeta(fixtureBytes, null, async (dir) => {
    await fetchUpstream('gstack', {
      metaDir: dir, licencePath: LICENCE, fetcher: serve(fixtureBytes), stagingRoot,
    });
  });
  assert.deepEqual(fs.readdirSync(stagingRoot), []);
  fs.rmSync(stagingRoot, { recursive: true, force: true });
});
