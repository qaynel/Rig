// Runtime evidence has scoped ownership: this writer restores preimages it
// owns. Dropping the whole reports/rig scope is the caller's explicit purge.
'use strict';
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { containedPath } = require('./path-safety');
const LEDGER = '.rig/evidence-artifacts.json';
const INTERNAL = new Set(['.rig/state.json', '.rig/grafts.md', '.rig/adopted-config.md', '.rig/overlaps.md', '.rig/onboarding-summary.md']);
const digest = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
function allowed(rel) {
  return INTERNAL.has(rel) || /^reports\/rig\/[^/]+\.json$/.test(rel);
}
function safeFile(target, rel) {
  if (!allowed(rel) && rel !== LEDGER) throw new Error(`rig: unsupported evidence path ${rel}`);
  const file = containedPath(target, rel);
  let cursor = path.resolve(target);
  for (const part of rel.split('/')) {
    cursor = path.join(cursor, part);
    if (fs.existsSync(cursor)) {
      const st = fs.lstatSync(cursor);
      if (st.isSymbolicLink() || (st.isFile() && st.nlink !== 1)) throw new Error(`rig: unsafe evidence path ${rel}`);
    }
  }
  return file;
}
function read(target) {
  const file = safeFile(target, LEDGER);
  if (!fs.existsSync(file)) return { schema_version: 1, entries: [] };
  const ledger = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (ledger.schema_version !== 1 || !Array.isArray(ledger.entries) || ledger.entries.some((r) => !allowed(r.path)
      || !/^[a-f0-9]{64}$/.test(r.digest) || (r.preimage !== null && typeof r.preimage !== 'string'))) throw new Error('rig: invalid evidence ownership ledger');
  if (new Set(ledger.entries.map((r) => r.path)).size !== ledger.entries.length) throw new Error('rig: duplicate evidence ownership');
  return ledger;
}
function save(target, ledger) {
  const file = safeFile(target, LEDGER);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temp = `${file}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(ledger) + '\n', { flag: 'wx', mode: 0o600 });
  fs.renameSync(temp, file);
}
function writeEvidence(target, rel, contents, openTemp = (temp, mode) => fs.openSync(temp, 'wx', mode)) {
  const file = safeFile(target, rel);
  const ledger = read(target);
  const before = fs.existsSync(file) ? fs.readFileSync(file) : null;
  let row = ledger.entries.find((r) => r.path === rel);
  if (row && before && digest(before) !== row.digest && digest(before) !== row.previous_digest) throw new Error(`rig: edited evidence ${rel}`);
  const bytes = Buffer.from(contents);
  if (!row) {
    row = { path: rel, preimage: before?.toString('base64') ?? null, mode: before ? fs.statSync(file).mode & 0o777 : null };
    ledger.entries.push(row);
  }
  row.previous_digest = before ? digest(before) : null;
  row.digest = digest(bytes);
  save(target, ledger); // preimage survives an interrupted target write
  const temp = `${file}.tmp`;
  fs.mkdirSync(path.dirname(file), { recursive: true });
  let fd;
  try {
    fd = openTemp(temp, row.mode ?? 0o600);
    fs.writeFileSync(fd, bytes);
  }
  catch (error) {
    if (error.code === 'EEXIST') throw new Error(`rig: onboarding temp file already exists (EEXIST); remove ${temp} to recover`);
    throw error;
  } finally { if (fd !== undefined) fs.closeSync(fd); }
  fs.renameSync(temp, file);
}
function cleanupEvidence(target) {
  const ledger = read(target);
  const retained = [];
  for (const row of ledger.entries) {
    const file = safeFile(target, row.path);
    const bytes = fs.existsSync(file) ? fs.readFileSync(file) : null;
    const preimage = row.preimage === null ? null : Buffer.from(row.preimage, 'base64');
    if (bytes && ![row.digest, row.previous_digest, preimage && digest(preimage)].includes(digest(bytes))) { retained.push(row.path); continue; }
    if (preimage) { fs.writeFileSync(file, preimage, { mode: row.mode }); fs.chmodSync(file, row.mode); }
    else if (bytes) fs.unlinkSync(file);
  }
  if (retained.length) save(target, { ...ledger, entries: ledger.entries.filter((r) => retained.includes(r.path)) });
  else {
    const file = safeFile(target, LEDGER);
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  for (const rel of ['reports/rig', 'reports', '.rig']) {
    const dir = containedPath(target, rel);
    if (fs.existsSync(dir) && fs.readdirSync(dir).length === 0) fs.rmdirSync(dir);
  }
  return retained;
}
module.exports = { writeEvidence, cleanupEvidence };
