'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

function resolveGitPath(tree, readBlob, original) {
  let current = original;
  const links = new Set();
  for (let hop = 0; hop < 64; hop += 1) {
    const parts = current.split('/');
    let replaced = false;
    for (let i = 1; i <= parts.length; i += 1) {
      const prefix = parts.slice(0, i).join('/');
      const entry = tree.get(prefix);
      if (entry?.mode === '120000') {
        if (links.has(prefix)) throw new Error(`symlink cycle at ${prefix}`);
        links.add(prefix);
        const target = readBlob(entry.blob).toString('utf8');
        const next = path.posix.normalize(path.posix.join(path.posix.dirname(prefix), target, ...parts.slice(i)));
        if (next === '..' || next.startsWith('../') || next.startsWith('/')) throw new Error(`symlink escapes upstream at ${prefix}`);
        current = next;
        replaced = true;
        break;
      }
      if (!entry && i === parts.length) throw new Error(`missing pinned tree path ${current}`);
    }
    if (replaced) continue;
    const entry = tree.get(current);
    if (!entry) throw new Error(`missing pinned tree path ${current}`);
    if (entry.mode === '120000') continue;
    return { path: current, entry };
  }
  throw new Error(`too many symlink hops at ${original}`);
}

function safeVendoredFile(root, id, relative) {
  if (typeof id !== 'string' || !id || id === '.' || id === '..' || path.isAbsolute(id) || /[\\/]/.test(id)) throw new Error('unsafe upstream id');
  if (typeof relative !== 'string' || !relative || path.posix.isAbsolute(relative) || relative.split('/').some((part) => !part || part === '.' || part === '..')) throw new Error('unsafe vendored path');
  const upstreamRoot = path.resolve(root, 'rig/upstreams', id);
  const file = path.resolve(upstreamRoot, ...relative.split('/'));
  if (!file.startsWith(`${upstreamRoot}${path.sep}`)) throw new Error('vendored path escapes upstream');
  const rootPath = path.resolve(root, 'rig/upstreams');
  if (fs.existsSync(rootPath) && fs.lstatSync(rootPath).isSymbolicLink()) throw new Error('upstream root is a symlink');
  const dirs = [upstreamRoot];
  let current = upstreamRoot;
  for (const part of relative.split('/').slice(0, -1)) { current = path.join(current, part); dirs.push(current); }
  for (const dir of dirs) {
    if (fs.existsSync(dir)) {
      const stat = fs.lstatSync(dir);
      if (stat.isSymbolicLink() || !stat.isDirectory()) throw new Error(`vendored parent is not a real directory: ${dir}`);
    }
  }
  if (fs.existsSync(file)) {
    const stat = fs.lstatSync(file);
    if (stat.isSymbolicLink() || !stat.isFile()) throw new Error(`vendored path is not a regular file: ${file}`);
  }
  return file;
}

function verifyUpstreamSource(root = process.cwd(), { repair = false, repositoryUrl = (upstream) => `https://github.com/${upstream.repo}.git` } = {}) {
  const lockFile = path.join(root, 'rig/upstreams/lock.json');
  const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-upstream-source-'));
  const failures = [];
  const git = (cwd, args, encoding = null) => execFileSync('git', ['-C', cwd, ...args], { encoding, maxBuffer: 1024 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
  const hash = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
  try {
    if (!Array.isArray(lock.upstreams)) return { ok: false, failures: [{ path: 'rig/upstreams/lock.json', reason: 'upstreams must be an array' }], upstreams: 0, files: 0 };
    for (const upstream of lock.upstreams) {
      if (!upstream || typeof upstream !== 'object') { failures.push({ path: 'rig/upstreams/lock.json', reason: 'upstream row must be an object' }); continue; }
      if (!upstream.included) continue;
      if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(upstream.repo) || !/^[0-9a-f]{40}$/i.test(upstream.commit)) {
        failures.push({ path: `rig/upstreams/${upstream.id}`, reason: 'invalid pinned GitHub repository or commit' });
        continue;
      }
      if (typeof upstream.id !== 'string' || !upstream.id || upstream.id === '.' || upstream.id === '..' || /[\\/]/.test(upstream.id)) {
        failures.push({ path: 'rig/upstreams/lock.json', reason: 'unsafe upstream id' });
        continue;
      }
      if (!Array.isArray(upstream.paths)) { failures.push({ path: `rig/upstreams/${upstream.id}`, reason: 'paths must be an array' }); continue; }
      const unsafePath = upstream.paths.find((entry) => !entry || typeof entry.path !== 'string' || !entry.path || path.posix.isAbsolute(entry.path) || entry.path.split('/').some((part) => !part || part === '.' || part === '..'));
      if (unsafePath) { failures.push({ path: `rig/upstreams/${upstream.id}`, reason: `unsafe locked path ${unsafePath?.path}` }); continue; }
      const repoDir = path.join(work, upstream.id);
      fs.mkdirSync(repoDir);
      execFileSync('git', ['init', '-q', repoDir], { stdio: 'ignore' });
      git(repoDir, ['remote', 'add', 'origin', repositoryUrl(upstream)]);
      git(repoDir, ['fetch', '-q', '--depth=1', '--filter=blob:none', 'origin', upstream.commit]);
      const commitDate = git(repoDir, ['show', '-s', '--format=%cI', upstream.commit], 'utf8').trim();
      const tree = new Map(git(repoDir, ['ls-tree', '-rz', '-r', upstream.commit], 'utf8').split('\0').filter(Boolean).map((row) => {
        const tab = row.indexOf('\t');
        const [mode, , blob] = row.slice(0, tab).split(' ');
        return [row.slice(tab + 1), { mode, blob }];
      }));
      if (!repair && upstream.commitDate !== commitDate) failures.push({ path: `rig/upstreams/${upstream.id}`, reason: `commit date mismatch (locked ${upstream.commitDate || 'missing'}, pinned ${commitDate})` });
      upstream.commitDate = commitDate;
      for (const entry of upstream.paths) {
        let resolved;
        try { resolved = resolveGitPath(tree, (blob) => git(repoDir, ['cat-file', 'blob', blob]), entry.path); }
        catch (error) { failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: error.message }); continue; }
        const { path: sourcePath, entry: source } = resolved;
        if (!repair && entry.gitBlob !== source.blob) failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: 'locked Git blob does not match pinned tree' });
        if (!repair && sourcePath !== entry.path && !entry.canonicalSourcePath) failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: `missing canonical source path for symlink alias ${sourcePath}` });
        if (entry.canonicalSourcePath && entry.canonicalSourcePath !== sourcePath && !repair) {
          failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: `canonical Git path mismatch (locked ${entry.canonicalSourcePath}, pinned ${sourcePath})` });
          continue;
        }
        let vendoredPath;
        let bytes;
        try { vendoredPath = safeVendoredFile(root, upstream.id, entry.path); bytes = fs.readFileSync(vendoredPath); }
        catch (error) { failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: `unsafe or unreadable vendored path (${error.message})` }); continue; }
        const actualGitBlob = crypto.createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
        if (actualGitBlob !== source.blob) {
          if (!repair) { failures.push({ path: `rig/upstreams/${upstream.id}/${entry.path}`, reason: 'vendored bytes differ from the pinned Git blob' }); continue; }
          const officialBytes = git(repoDir, ['cat-file', 'blob', source.blob]);
          fs.writeFileSync(vendoredPath, officialBytes);
          bytes = officialBytes;
        }
        entry.gitBlob = source.blob;
        entry.sha256 = hash(bytes);
        entry.bytes = bytes.length;
        if (sourcePath !== entry.path) entry.canonicalSourcePath = sourcePath;
        else delete entry.canonicalSourcePath;
      }
    }
    if (repair) fs.writeFileSync(lockFile, `${JSON.stringify(lock, null, 2)}\n`);
    return { ok: failures.length === 0, failures, upstreams: lock.upstreams.filter((row) => row?.included).length, files: lock.upstreams.reduce((sum, row) => sum + (row?.included && Array.isArray(row.paths) ? row.paths.length : 0), 0) };
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

if (require.main === module) {
  const repair = process.argv.includes('--repair');
  const result = verifyUpstreamSource(process.cwd(), { repair });
  for (const failure of result.failures) process.stderr.write(`${failure.path}: ${failure.reason}\n`);
  if (!result.ok) process.exitCode = 1;
  else process.stdout.write(`Verified ${result.files} source files across ${result.upstreams} pinned commits${repair ? ' and repaired bytes' : ''}.\n`);
}

module.exports = { verifyUpstreamSource, resolveGitPath, safeVendoredFile };
