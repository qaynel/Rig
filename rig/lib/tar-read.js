// Minimal, strict tar reader for verified upstream archives. Pure: operates on
// a Buffer. It exists so extraction never shells out and never creates a link,
// device, absolute or escaping path on disk: only regular files are returned,
// and anything else that could alias another location is a refusal.
'use strict';

const MAX_ENTRIES = 200000;

function field(block, start, length) {
  const raw = block.subarray(start, start + length);
  const end = raw.indexOf(0);
  return raw.subarray(0, end === -1 ? raw.length : end).toString('utf8');
}

function octal(block, start, length) {
  const text = field(block, start, length).trim();
  if (!text) return 0;
  if (!/^[0-7]+$/.test(text)) throw new Error('malformed tar numeric field');
  return parseInt(text, 8);
}

function parsePax(bytes) {
  const out = {};
  let offset = 0;
  while (offset < bytes.length) {
    const space = bytes.indexOf(0x20, offset);
    if (space === -1) break;
    const length = Number(bytes.subarray(offset, space).toString('utf8'));
    if (!Number.isInteger(length) || length <= 0) throw new Error('malformed pax header');
    const record = bytes.subarray(space + 1, offset + length - 1).toString('utf8');
    const eq = record.indexOf('=');
    if (eq > 0) out[record.slice(0, eq)] = record.slice(eq + 1);
    offset += length;
  }
  return out;
}

function cleanPath(name) {
  const parts = name.split('/').filter((part) => part !== '');
  if (!parts.length || name.startsWith('/') || name.includes('\\') || name.includes('\0') || parts.some((part) => part === '..' || part === '.')) {
    throw new Error(`unsafe archive path "${name}"`);
  }
  return parts.join('/');
}

// Returns Map(path -> Buffer) of regular files, with the single leading
// directory (`<repo>-<rev>/`) stripped. Symlinks, hard links, devices and FIFOs
// inside the archive are refused outright.
function readTar(buffer, { stripComponents = 1 } = {}) {
  const files = new Map();
  let offset = 0;
  let pax = {};
  let globalPax = {};
  let longName = null;
  let count = 0;
  while (offset + 512 <= buffer.length) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) break;
    if (++count > MAX_ENTRIES) throw new Error('archive has too many entries');
    const size = octal(header, 124, 12);
    const type = String.fromCharCode(header[156] || 0x30);
    const dataStart = offset + 512;
    const dataEnd = dataStart + size;
    if (dataEnd > buffer.length) throw new Error('truncated archive');
    const data = buffer.subarray(dataStart, dataEnd);
    offset = dataStart + Math.ceil(size / 512) * 512;
    if (type === 'x') { pax = parsePax(data); continue; }
    if (type === 'g') { globalPax = { ...globalPax, ...parsePax(data) }; continue; }
    if (type === 'L') { longName = field(data, 0, data.length); continue; }
    const prefix = field(header, 345, 155);
    const base = field(header, 0, 100);
    const name = pax.path || globalPax.path || longName || (prefix ? `${prefix}/${base}` : base);
    pax = {};
    longName = null;
    if (type === '5') { cleanPath(name); continue; }
    if (type !== '0' && type !== '\0') throw new Error(`archive entry "${name}" is a ${type === '2' ? 'symlink' : type === '1' ? 'hard link' : 'special file'}; refused`);
    const parts = cleanPath(name).split('/');
    if (parts.length <= stripComponents) throw new Error(`archive entry "${name}" is outside the top-level directory`);
    const rel = parts.slice(stripComponents).join('/');
    if (files.has(rel)) throw new Error(`archive lists "${rel}" twice`);
    files.set(rel, Buffer.from(data));
  }
  return files;
}

module.exports = { readTar };
