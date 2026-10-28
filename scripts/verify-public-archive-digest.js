#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const crypto = require('node:crypto');

const [archive] = process.argv.slice(2);
const expected = process.env.RIG_PUBLIC_ARCHIVE_SHA256 || '';
if (!archive || !/^[a-f0-9]{64}$/.test(expected)) {
  console.error('public archive verification requires an archive path and trusted RIG_PUBLIC_ARCHIVE_SHA256');
  process.exit(2);
}
const actual = crypto.createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
if (actual !== expected) {
  console.error(`public archive digest mismatch: expected ${expected}, got ${actual}`);
  process.exit(1);
}
fs.writeFileSync(`${archive}.sha256`, `${expected}  ${archive.split(/[\\/]/).at(-1)}\n`);
console.log(`verified public archive sha256=${actual}`);
