'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { readTar } = require('../rig/lib/tar-read');

function archive(link) {
  const header = Buffer.alloc(512);
  header.write('repo/bin/reader');
  header.write('00000000000\0', 124);
  header.write('2', 156);
  header.write(link, 157);
  return Buffer.concat([header, Buffer.alloc(1024)]);
}

test('only an explicitly pinned unmaterialized upstream link can be ignored', () => {
  const bytes = archive('consumer');
  assert.throws(() => readTar(bytes), /symlink/);
  assert.deepEqual([...readTar(bytes, { ignoredLinks: { 'bin/reader': 'consumer' } })], []);
  assert.throws(() => readTar(archive('../../outside'), { ignoredLinks: { 'bin/reader': 'consumer' } }), /symlink|unsafe/);
  assert.throws(() => readTar(archive('other'), { ignoredLinks: { 'bin/reader': 'consumer' } }), /symlink/);
});
