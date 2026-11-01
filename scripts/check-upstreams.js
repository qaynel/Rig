'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { scanFiles } = require('./repo-secret-scan');

const DEFAULT_MAX_BYTES = 250 * 1024 * 1024;
const ROOT_METADATA = new Set(['lock.json', 'role-map.json', 'approved-executables.json', 'NOTICES.md']);
const PERMISSIVE = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC']);
const EXECUTABLE_EXT = /\.(?:sh|js|ts|py|mjs)$/i;
const NETWORK = [/\bfetch\s*\(/i, /\bhttp\.request\b/i, /\bhttps\./i, /(?:node:)?net[^;\n]{0,40}\.connect\s*\(/i, /\bcurl\s+/i, /\bwget\s+/i, /\brequests\./i, /\burllib\b/i, /\bWebSocket\b/i, /\bsocket\./i];
const OUTSIDE_WRITE = [/(?:^|[\s"'`])~\//, /\$HOME\b/, /\b(?:\/etc\/|os\.homedir\s*\()/, /(?:writeFile|appendFile|mkdir|rename|copyFile|unlink|open)\w*\s*\([^\n]*['"]\//, /['"`]\/(?:[^/'"`\s]+\/)+[^'"`\s]*/];
const OBFUSCATION = [/\beval\s*\(/, /\bFunction\s*\(/, /[A-Za-z0-9+/]{201,}={0,2}/];

function walk(root) {
  const files = [];
  function visit(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) files.push({ file, type: 'symlink' });
      else if (entry.isDirectory()) visit(file);
      else if (entry.isFile()) files.push({ file, type: 'file' });
    }
  }
  if (fs.existsSync(root)) visit(root);
  return files;
}

function checkUpstreams(root = process.cwd(), { maxBytes = DEFAULT_MAX_BYTES } = {}) {
  const upstreamRoot = path.join(root, 'rig/upstreams');
  const failures = [];
  const fail = (file, reason) => failures.push({ path: file, reason });
  if (fs.existsSync(upstreamRoot) && fs.lstatSync(upstreamRoot).isSymbolicLink()) {
    fail('rig/upstreams', 'upstream root must not be a symlink');
    return { ok: false, failures, measuredBytes: 0, maxBytes, overrunBytes: 0 };
  }
  const readJson = (file, fallback) => {
    try { return JSON.parse(fs.readFileSync(path.join(upstreamRoot, file), 'utf8')); }
    catch (error) { fail(`rig/upstreams/${file}`, `invalid or missing JSON (${error.message})`); return fallback; }
  };
  const lock = readJson('lock.json', { upstreams: [] });
  const approved = readJson('approved-executables.json', []);
  if (!Array.isArray(lock.upstreams)) { fail('rig/upstreams/lock.json', 'upstreams must be an array'); lock.upstreams = []; }
  if (!Array.isArray(approved)) { fail('rig/upstreams/approved-executables.json', 'approvals must be an array'); }
  const locked = new Map();
  let measuredBytes = 0;
  for (const upstream of lock.upstreams || []) {
    if (!upstream || typeof upstream !== 'object') { fail('rig/upstreams/lock.json', 'upstream row must be an object'); continue; }
    if (typeof upstream.id !== 'string' || !upstream.id || upstream.id === '.' || upstream.id === '..' || path.isAbsolute(upstream.id) || /[\\/]/.test(upstream.id)) { fail(`rig/upstreams/${upstream.id || 'lock.json'}`, 'unsafe upstream id'); continue; }
    if (!Array.isArray(upstream.paths)) { fail(`rig/upstreams/${upstream.id}`, 'paths must be an array'); upstream.paths = []; }
    if (typeof upstream.included !== 'boolean' || typeof upstream.reason !== 'string' || !upstream.reason.trim()) fail(`rig/upstreams/${upstream.id}`, 'missing inclusion status or reason');
    if (upstream.included && !PERMISSIVE.has(upstream.licence)) fail(`rig/upstreams/${upstream.id}`, `disallowed licence ${upstream.licence}`);
    if (!upstream.included && (upstream.paths || []).length) fail(`rig/upstreams/${upstream.id}`, 'excluded upstream has shipped paths');
    for (const entry of upstream.paths || []) {
      const rel = entry.path;
      if (typeof rel !== 'string' || !rel || path.isAbsolute(rel) || rel.split(/[\\/]/).some((part) => !part || part === '.' || part === '..')) { fail(`rig/upstreams/${upstream.id}/${rel || ''}`, 'unsafe lock path'); continue; }
      const file = path.resolve(upstreamRoot, upstream.id, rel);
      if (!file.startsWith(`${path.resolve(upstreamRoot, upstream.id)}${path.sep}`)) { fail(`rig/upstreams/${upstream.id}/${rel}`, 'path escapes upstream'); continue; }
      const key = path.resolve(file);
      if (locked.has(key)) fail(`rig/upstreams/${upstream.id}/${rel}`, 'duplicate lock path');
      locked.set(key, entry);
      let bytes;
      try { bytes = fs.readFileSync(file); }
      catch { fail(`rig/upstreams/${upstream.id}/${rel}`, 'locked file is missing or unreadable'); continue; }
      const digest = require('node:crypto').createHash('sha256').update(bytes).digest('hex');
      if (digest !== entry.sha256) fail(`rig/upstreams/${upstream.id}/${rel}`, 'SHA-256 mismatch');
      if (entry.gitBlob) {
        const gitBlob = require('node:crypto').createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
        if (gitBlob !== entry.gitBlob) fail(`rig/upstreams/${upstream.id}/${rel}`, 'pinned Git blob mismatch');
      }
      if (bytes.length !== entry.bytes) fail(`rig/upstreams/${upstream.id}/${rel}`, 'byte count mismatch');
      measuredBytes += bytes.length;
    }
  }
  const actual = walk(upstreamRoot).filter(({ file }) => {
    const relative = path.relative(upstreamRoot, file);
    return relative.includes(path.sep) || !ROOT_METADATA.has(path.basename(file));
  });
  for (const { file, type } of actual) {
    if (type !== 'file') { fail(path.relative(root, file), 'symlink is not allowed in snapshot'); continue; }
    if (!locked.has(path.resolve(file))) fail(path.relative(root, file), 'file is absent from lock');
  }
  for (const [file] of locked) if (!fs.existsSync(file)) fail(path.relative(root, file), 'locked file is absent from snapshot');

  const approvals = new Map();
  for (const item of Array.isArray(approved) ? approved : []) {
    if (!item || typeof item.path !== 'string' || typeof item.sha256 !== 'string' || !item.reason?.trim() || !item.approvedIn?.trim()) {
      fail('rig/upstreams/approved-executables.json', 'approval row requires path, hash, reason, and approval evidence');
      continue;
    }
    approvals.set(item.path, item);
  }
  const executableFiles = [];
  const safetyFiles = [];
  for (const { file, type } of actual) {
    if (type !== 'file') continue;
    const bytes = fs.readFileSync(file);
    const rel = path.relative(root, file).split(path.sep).join('/');
    const mode = fs.statSync(file).mode;
    const entry = locked.get(path.resolve(file));
    const executable = EXECUTABLE_EXT.test(file) || Boolean(mode & 0o111) || entry?.kind === 'hook';
    const text = bytes.toString('utf8');
    if (executable) {
      executableFiles.push({ path: rel, bytes });
      const approval = approvals.get(rel);
      const sha256 = require('node:crypto').createHash('sha256').update(bytes).digest('hex');
      if (!approval || approval.sha256 !== sha256 || !approval.reason?.trim() || !approval.approvedIn?.trim()) fail(rel, 'executable lacks a matching path/hash approval');
      text.split(/\r?\n/).forEach((line, index) => {
        const number = index + 1;
        if (NETWORK.some((pattern) => pattern.test(line)) && !approval?.network?.trim()) fail(rel, `line ${number}: network access requires an explicit approval reason`);
        if (OUTSIDE_WRITE.some((pattern) => pattern.test(line))) fail(rel, `line ${number}: possible write outside repository`);
        if (line.length > 1000 || OBFUSCATION.some((pattern) => pattern.test(line))) fail(rel, `line ${number}: obfuscated or oversized source line`);
      });
    }
    safetyFiles.push({ path: rel, content: bytes });
  }
  for (const approval of approvals.values()) if (!executableFiles.some((file) => file.path === approval.path)) fail(approval.path, 'approval does not name a vendored executable');
  for (const finding of scanFiles(safetyFiles).filter((item) => item.startsWith('rig/upstreams/'))) {
    const split = finding.indexOf(':'); fail(finding.slice(0, split), `secret scan: ${finding.slice(split + 1).trim()}`);
  }

  const modelRoot = path.join(root, 'rig/catalog/baseline/assets/potion-base-2m');
  if (!fs.existsSync(modelRoot) || !fs.statSync(modelRoot).isDirectory()) fail('rig/catalog/baseline/assets/potion-base-2m', 'local search model assets are missing');
  else for (const item of walk(modelRoot)) if (item.type === 'file') measuredBytes += fs.statSync(item.file).size;
  const overrunBytes = Math.max(0, measuredBytes - maxBytes);
  if (overrunBytes) fail('rig/upstreams', `payload plus local search model exceeds cap by ${overrunBytes} bytes`);
  failures.sort((a, b) => a.path.localeCompare(b.path) || a.reason.localeCompare(b.reason));
  return { ok: failures.length === 0, failures, measuredBytes, maxBytes, overrunBytes };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const rootIndex = args.indexOf('--root');
  const root = rootIndex >= 0 ? args[rootIndex + 1] : process.cwd();
  const result = checkUpstreams(root);
  for (const failure of result.failures) process.stderr.write(`${failure.path}: ${failure.reason}\n`);
  if (result.failures.length) process.exitCode = 1;
  else process.stdout.write(`Upstream snapshot OK (${result.measuredBytes} bytes)\n`);
}

module.exports = { checkUpstreams, DEFAULT_MAX_BYTES };
