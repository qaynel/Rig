'use strict';

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { verifyUpstreamSource } = require('./verify-upstream-source');

const ALLOWED = new Set(['MIT', 'Apache-2.0', 'BSD-2-Clause', 'BSD-3-Clause', 'ISC']);
const META = new Set(['lock.json', 'role-map.json', 'approved-executables.json', 'NOTICES.md']);
const sha256 = (data) => crypto.createHash('sha256').update(data).digest('hex');
const rel = (root, file) => path.relative(root, file).split(path.sep).join('/');

function safeSource(root, relative) {
  if (typeof relative !== 'string' || !relative || path.isAbsolute(relative) || relative.split(/[\\/]/).some((part) => part === '..' || part === '.')) throw new Error(`Unsafe source path: ${relative}`);
  const file = path.resolve(root, relative);
  const boundary = `${path.resolve(root)}${path.sep}`;
  if (!file.startsWith(boundary) || !fs.existsSync(file)) throw new Error(`Missing or escaping source path: ${relative}`);
  const realRoot = fs.realpathSync(root);
  const realFile = fs.realpathSync(file);
  const realBoundary = `${realRoot}${path.sep}`;
  if (!realFile.startsWith(realBoundary)) throw new Error(`Source link escapes upstream: ${relative}`);
  if (!fs.statSync(realFile).isFile()) throw new Error(`Unsupported source type: ${relative}`);
  return realFile;
}

function listTree(root, upstreamRoot) {
  const out = [];
  const realRoot = fs.realpathSync(upstreamRoot);
  function visit(dir, ancestors = new Set()) {
    const realDir = fs.realpathSync(dir);
    if (ancestors.has(realDir)) throw new Error(`Symlink cycle in selected tree: ${dir}`);
    const nextAncestors = new Set(ancestors).add(realDir);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) {
        const target = fs.realpathSync(file);
        const boundary = `${realRoot}${path.sep}`;
        if (!target.startsWith(boundary)) throw new Error(`Symlink escapes upstream: ${rel(root, file)}`);
        if (fs.statSync(target).isDirectory()) visit(file, nextAncestors);
        else if (fs.statSync(target).isFile()) out.push(file);
        else throw new Error(`Unsupported selected symlink: ${rel(root, file)}`);
      } else if (entry.isDirectory()) visit(file, nextAncestors);
      else if (entry.isFile()) out.push(file);
      else throw new Error(`Unsupported selected entry: ${rel(root, file)}`);
    }
  }
  visit(root);
  return out;
}

function parseInventoryRow(line) {
  const cols = line.trim().replace(/^\|\s*/, '').replace(/\s*\|$/, '').split(/\s*\|\s*/);
  const repo = cols[0]?.match(/\]\(https:\/\/github\.com\/([^)]*)\)/)?.[1];
  if (!repo || !/^[0-9a-f]{40}$/i.test(cols[2])) return null;
  return { repo, commit: cols[2], commitDate: `${cols[3]}T00:00:00Z`, licence: cols[4], stars: Number(cols[6].replace(/,/g, '')), lastPush: `${cols[7]}T00:00:00Z`, reason: cols[9] };
}

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!['--root', '--fork', '--inventory'].includes(args[i]) || !args[i + 1]) throw new Error('Usage: node scripts/rebuild/vendor.js [--root <repo>] [--fork <dir>] [--inventory <file>]');
    const key = args[i].slice(2);
    options[key === 'inventory' ? 'sourceInventoryFile' : key] = args[i + 1];
    i += 1;
  }
  return options;
}

function buildSnapshot({ root = process.cwd(), fork = process.env.RIG_FORK_DIR || '/Users/winmore/conductor/workspaces/rig-v0.1/davao-v1/.context/fork', sourceInventoryFile = process.env.RIG_SOURCE_INVENTORY || '/Users/winmore/conductor/workspaces/rig-v0.1/davao-v1/.context/rebuild/inventory.json' } = {}) {
  const roleMapFile = path.join(root, 'wiki/specs/rebuild/role-map.json');
  const inventoryFile = path.join(root, 'wiki/specs/rebuild/inventory.md');
  const rolesDoc = JSON.parse(fs.readFileSync(roleMapFile, 'utf8'));
  const priorLockFile = path.join(root, 'rig/upstreams/lock.json');
  const priorLock = fs.existsSync(priorLockFile) ? JSON.parse(fs.readFileSync(priorLockFile, 'utf8')) : { upstreams: [] };
  const priorUpstreams = new Map((priorLock.upstreams || []).map((row) => [row.id, row]));
  const sourceRows = fs.readFileSync(inventoryFile, 'utf8').split(/\r?\n/).map(parseInventoryRow).filter(Boolean);
  const rowByRepo = new Map(sourceRows.map((row) => [row.repo.toLowerCase(), row]));
  const inventory = JSON.parse(fs.readFileSync(sourceInventoryFile, 'utf8'));
  const byId = new Map(inventory.upstreams.map((row) => [row.id, row]));
  const selected = new Map();
  const pick = (upstream, sourcePath, role, kind) => {
    if (!selected.has(upstream)) selected.set(upstream, new Map());
    const paths = selected.get(upstream);
    if (!paths.has(sourcePath)) paths.set(sourcePath, { role, kind });
    else if (role && !paths.get(sourcePath).role) paths.get(sourcePath).role = role;
  };
  for (const role of rolesDoc.roles) {
    for (const item of [{ ...role.owner, kind: 'owner' }, ...(role.merged || []).map((p) => ({ ...p, kind: 'merged' }))]) {
      const found = byId.get(item.upstream);
      if (!found) throw new Error(`Unknown upstream ${item.upstream}`);
      const piece = found.pieces.find((candidate) => candidate.path === item.path);
      if (!piece) throw new Error(`Selected source not inventoried: ${item.upstream}/${item.path}`);
      pick(item.upstream, item.path, role.id, piece.kind);
      if (item.path.endsWith('/SKILL.md')) {
        const dir = path.posix.dirname(item.path);
        const sourceRoot = path.join(fork, found.category, found.id, dir);
        for (const file of listTree(sourceRoot, path.join(fork, found.category, found.id))) pick(item.upstream, `${dir}/${rel(sourceRoot, file)}`, role.id, 'skill-resource');
      }
    }
  }

  const output = path.join(root, 'rig/upstreams');
  fs.mkdirSync(output, { recursive: true });
  for (const old of fs.readdirSync(output)) {
    if (!META.has(old)) fs.rmSync(path.join(output, old), { recursive: true, force: true });
  }
  const upstreamRows = [];
  const noticeLines = ['# Third-party notices', '', 'Rig includes the following unmodified upstream source files. Branding and unrelated repository files are omitted.', ''];
  for (const source of inventory.upstreams) {
    const metadata = [...rowByRepo.values()].find((row) => row.repo.split('/').at(-1).toLowerCase() === source.id.split('__').at(-1).toLowerCase());
    if (!metadata || metadata.commit !== source.commit) throw new Error(`Inventory metadata does not bind to source pin: ${source.id}`);
    const paths = selected.get(source.id);
    const included = Boolean(paths?.size);
    const prior = priorUpstreams.get(source.id);
    const row = { id: source.id, repo: metadata.repo, commit: source.commit, commitDate: prior?.commit === source.commit ? prior.commitDate : `${metadata.commitDate.slice(0, 10)}T00:00:00Z`, licence: source.licence, stars: metadata.stars, lastPush: metadata.lastPush, ...(metadata.stars < 1000 ? { curatedTopList: true } : {}), included, reason: included ? metadata.stars < 1000 ? `Curated top list: ${metadata.reason}` : metadata.reason : 'No paths selected by the approved role map.', paths: [] };
    if (included && !ALLOWED.has(row.licence)) throw new Error(`${source.id}: disallowed licence ${row.licence}`);
    if (included) {
      const upstreamSourceRoot = path.join(fork, source.category, source.id);
      const notices = fs.readdirSync(upstreamSourceRoot).filter((name) => /^NOTICE(?:\..*)?$/i.test(name));
      for (const licencePath of [source.licenceFile, ...notices]) {
        if (licencePath) pick(source.id, licencePath, '', licencePath.toLowerCase().startsWith('notice') ? 'notice' : 'license');
      }
      const destination = path.join(output, source.id);
      for (const [sourcePath, detail] of [...paths.entries()].sort(([a], [b]) => a.localeCompare(b))) {
        const sourceFile = safeSource(path.join(fork, source.category, source.id), sourcePath);
        const bytes = fs.readFileSync(sourceFile);
        const sourcePiece = source.pieces.find((piece) => piece.path === sourcePath);
        if (sourcePiece && (sourcePiece.sha256 !== sha256(bytes) || sourcePiece.bytes !== bytes.length)) throw new Error(`Fork bytes do not match recorded inventory: ${source.id}/${sourcePath}`);
        const destFile = path.join(destination, ...sourcePath.split('/'));
        fs.mkdirSync(path.dirname(destFile), { recursive: true });
        fs.writeFileSync(destFile, bytes, { mode: fs.statSync(sourceFile).mode & 0o777 });
        const previousPath = prior?.commit === row.commit ? prior.paths?.find((entry) => entry.path === sourcePath) : null;
        row.paths.push({ path: sourcePath, sha256: sha256(bytes), bytes: bytes.length, role: detail.kind === 'skill-resource' ? '' : detail.role || '', ...(detail.kind === 'skill-resource' ? { resourceForRole: detail.role } : {}), kind: detail.kind, ...(previousPath?.gitBlob ? { gitBlob: previousPath.gitBlob } : {}), ...(previousPath?.canonicalSourcePath ? { canonicalSourcePath: previousPath.canonicalSourcePath } : {}) });
      }
      const licenseEntry = row.paths.find((entry) => /^(LICEN[CS]E|COPYING)(\.|$)/i.test(path.basename(entry.path)) && !entry.path.includes('/'));
      if (!licenseEntry) throw new Error(`${source.id}: missing root licence file`);
      const licenseText = fs.readFileSync(path.join(destination, licenseEntry.path), 'utf8');
      const copyright = licenseText.split(/\r?\n/).find((line) => /copyright/i.test(line) && /\d{4}/.test(line));
      noticeLines.push(`## ${metadata.repo}`, '', `- Licence: ${row.licence}`, ...(copyright ? [`- ${copyright.trim()}`] : []), '');
    }
    upstreamRows.push(row);
  }
  fs.writeFileSync(path.join(output, 'role-map.json'), `${JSON.stringify(rolesDoc, null, 2)}\n`);
  fs.writeFileSync(path.join(output, 'approved-executables.json'), '[]\n');
  fs.writeFileSync(path.join(output, 'NOTICES.md'), `${noticeLines.join('\n')}\n`);
  fs.writeFileSync(path.join(output, 'lock.json'), `${JSON.stringify({ upstreams: upstreamRows }, null, 2)}\n`);
  const sourceCheck = verifyUpstreamSource(root, { repair: true });
  if (!sourceCheck.ok) throw new Error(sourceCheck.failures.map((item) => `${item.path}: ${item.reason}`).join('\n'));
  const finalRows = JSON.parse(fs.readFileSync(path.join(output, 'lock.json'), 'utf8')).upstreams;
  const payloadBytes = finalRows.reduce((total, row) => total + row.paths.reduce((sum, entry) => sum + fs.statSync(path.join(output, row.id, ...entry.path.split('/'))).size, 0), 0);
  return { upstreams: finalRows, payloadBytes };
}

if (require.main === module) {
  try { const result = buildSnapshot(parseArgs(process.argv.slice(2))); process.stdout.write(`Snapshotted ${result.upstreams.filter((u) => u.included).length} upstreams, ${result.upstreams.reduce((n, u) => n + u.paths.length, 0)} files, ${result.payloadBytes} bytes\n`); }
  catch (error) { process.stderr.write(`${error.message}\n`); process.exitCode = 1; }
}

module.exports = { buildSnapshot, safeSource };
