#!/usr/bin/env node
// Self-contained public archive; no external tar tool or machine metadata.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

const ROOT = path.resolve(__dirname, '..');
const PLATFORMS = ['darwin', 'linux', 'win32'];
const INCLUDE = ['rig', 'skills/rig', 'package.json', 'LICENSE'];
const SKIP = new Set(['.DS_Store', 'node_modules', '__pycache__']);

const sha256 = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');

function collect(root, rel, files, ancestors = new Set()) {
  if (SKIP.has(path.basename(rel)) || path.basename(rel).startsWith('._')) return;
  const abs = path.join(root, rel);
  const real = fs.realpathSync(abs);
  if (!real.startsWith(`${fs.realpathSync(root)}${path.sep}`)) throw new Error(`archive source escapes checkout: ${rel}`);
  const stat = fs.statSync(abs);
  if (stat.isDirectory()) {
    if (ancestors.has(real)) throw new Error(`archive source has a directory cycle: ${rel}`);
    for (const name of fs.readdirSync(abs).sort()) collect(root, path.join(rel, name), files, new Set([...ancestors, real]));
  } else {
    if (!stat.isFile()) throw new Error(`archive source is not a regular file: ${rel}`);
    files.set(rel.split(path.sep).join('/'), { bytes: fs.readFileSync(abs), mode: stat.mode & 0o111 ? 0o755 : 0o644 });
  }
}

// rig: ustar's 100-byte name + 155-byte prefix cover this kit. Refuse longer
// paths rather than truncate; add PAX records only if the corpus needs them.
function tarEntry(name, { bytes, mode }) {
  let base = name;
  let prefix = '';
  if (Buffer.byteLength(base) > 100) {
    const split = [...name.matchAll(/\//g)].map((match) => match.index).reverse()
      .find((index) => Buffer.byteLength(name.slice(0, index)) <= 155 && Buffer.byteLength(name.slice(index + 1)) <= 100);
    if (split === undefined) throw new Error(`archive path exceeds ustar limits: ${name}`);
    prefix = name.slice(0, split);
    base = name.slice(split + 1);
  }
  if (bytes.length > 0o77777777777) throw new Error(`archive file exceeds ustar size: ${name}`);
  const header = Buffer.alloc(512);
  header.write(base, 0, 100);
  header.write(`${mode.toString(8).padStart(7, '0')}\0`, 100);
  header.write('0000000\0', 108); // uid
  header.write('0000000\0', 116); // gid
  header.write(`${bytes.length.toString(8).padStart(11, '0')}\0`, 124);
  header.write('00000000000\0', 136); // mtime
  header.write('        ', 148);
  header.write('0', 156); // dereferenced regular files only
  header.write('ustar\0', 257);
  header.write('00', 263);
  header.write(prefix, 345, 155);
  const sum = header.reduce((total, byte) => total + byte, 0);
  header.write(`${sum.toString(8).padStart(6, '0')}\0 `, 148);
  return [header, bytes, Buffer.alloc((512 - bytes.length % 512) % 512)];
}

function buildArchive(root = ROOT, dist = path.join(root, '.context', 'dist')) {
  const version = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).version;
  if (typeof version !== 'string' || !/^[0-9]+\.[0-9]+\.[0-9]+(?:-[0-9A-Za-z.-]+)?$/.test(version)) throw new Error('invalid archive version');
  const top = `rig-public-${version}`;
  const files = new Map();
  for (const rel of INCLUDE) collect(root, rel, files);
  for (const needed of ['rig/bootstrap.sh', 'rig/manifest.json', 'rig/catalog/baseline/embedding.js',
    'rig/catalog/baseline/assets/potion-base-2m/model.json']) {
    if (!files.has(needed)) throw new Error(`archive would be missing ${needed}`);
  }
  const digests = Object.fromEntries([...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([rel, { bytes }]) => [rel, sha256(bytes)]));
  files.set('rig-archive.json', { bytes: Buffer.from(`${JSON.stringify({ version, platforms: PLATFORMS, files: digests }, null, 2)}\n`), mode: 0o644 });
  const blocks = [...files].sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .flatMap(([rel, entry]) => tarEntry(`${top}/${rel}`, entry));
  // rig: this kit is ~17 MB; buffer once. Stream if the shipped kit grows large.
  const archive = zlib.gzipSync(Buffer.concat([...blocks, Buffer.alloc(1024)]), { level: 9 });
  fs.mkdirSync(dist, { recursive: true });
  const file = path.join(dist, `${top}.tar.gz`);
  fs.writeFileSync(file, archive);
  const digest = sha256(archive);
  fs.writeFileSync(`${file}.sha256`, `${digest}  ${path.basename(file)}\n`);
  return { file, digest };
}

if (require.main === module) {
  const { file, digest } = buildArchive();
  console.log(file);
  console.log(`sha256 ${digest}`);
}

module.exports = { buildArchive, tarEntry };
