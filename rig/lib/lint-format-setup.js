'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { sha256, canonical } = require('./skill-catalog');
const { containedPath } = require('./path-safety');
const { verifySshsig } = require('./policy');
const CONTRACTS = {
  js: {tool:'biome', files:['biome.json','eslint.config.js','.prettierrc.json','.prettierignore','.eslintignore']},
  python: {tool:'ruff', files:['pyproject.toml']},
  shell: {tool:'shellcheck + shfmt', files:['.shellcheckrc']},
  go: {tool:'golangci-lint + gofmt', files:['.golangci.yml']},
  ruby: {tool:'rubocop', files:['.rubocop.yml']},
};
function fileBytes(target, rel) {
  const abs = containedPath(target, rel);
  let cursor = fs.realpathSync(target);
  for (const part of path.relative(cursor, abs).split(path.sep)) {
    cursor = path.join(cursor, part);
    try { if (fs.lstatSync(cursor).isSymbolicLink()) throw new Error(`setup refuses symlink: ${rel}`); }
    catch (error) { if (error.code === 'ENOENT') break; throw error; }
  }
  if (!fs.existsSync(abs)) return null;
  const stat = fs.lstatSync(abs);
  if (!stat.isFile() || stat.nlink !== 1) throw new Error(`setup refuses non-regular config: ${rel}`);
  return fs.readFileSync(abs);
}
function allowedPath(ecosystem, rel) {
  return typeof rel === 'string' && !path.isAbsolute(rel) && !rel.includes('\\')
    && !rel.split('/').some(p => !p || p === '.' || p === '..' || p.startsWith('.rig') || p === '.git')
    && CONTRACTS[ecosystem]?.files.includes(path.posix.basename(rel));
}
// rig: conservative section scanner, not a TOML parser. Multiline strings and
// quoted table keys refuse; add a TOML parser if a repository requires those.
function unmanagedToml(text) {
  if (/'''|"""/.test(text)) throw new Error('shared TOML section scanner does not support multiline strings');
  let owned = false;
  return text.split(/(?<=\n)/).filter(line => {
    if (/^\s*\[/.test(line)) {
      const m = line.match(/^\s*\[([A-Za-z0-9_.-]+)\]\s*(?:#.*)?(?:\r?\n)?$/);
      if (!m) throw new Error('unsupported TOML section header');
      owned = /^tool\.(?:ruff|black|isort|mypy)(?:\.|$)/.test(m[1]);
    }
    return !owned;
  }).join('');
}
function proposeSetup({target, ecosystem, existing_tool = null, signals = [], coverage_gaps = [], writes = []}) {
  const contract = CONTRACTS[ecosystem];
  if (!contract) return {action:'skip', reason:'unsupported ecosystem'};
  if (!Array.isArray(signals) || !Array.isArray(coverage_gaps)
    || [...signals,...coverage_gaps].some(s => typeof s !== 'string' || !s.trim())) throw new Error('invalid setup signals');
  if (existing_tool && !signals.length && !coverage_gaps.length) return {action:'preserve', tool:existing_tool};
  if (!Array.isArray(writes) || !writes.length) throw new Error('setup proposal requires exact write scope');
  const seen = new Set();
  const rows = writes.map(row => {
    if (!allowedPath(ecosystem,row.path) || seen.has(row.path) || typeof row.content !== 'string' || Buffer.byteLength(row.content) > 262144) throw new Error('invalid setup write scope');
    seen.add(row.path);
    const before = fileBytes(target,row.path);
    if (path.posix.basename(row.path) === 'pyproject.toml'
      && unmanagedToml(before?.toString('utf8') || '') !== unmanagedToml(row.content)) throw new Error('shared TOML may change only approved tool sections');
    return {path:row.path,content:row.content,preimage_digest:before === null ? null : sha256(before)};
  });
  const body = {schema_version:1,kind:'lint-format-setup',action:existing_tool ? 'replace':'setup',ecosystem,tool:contract.tool,existing_tool,signals,coverage_gaps,writes:rows};
  return {...body,digest:sha256(canonical(body))};
}
function approvalMessage(digest) {return `rig-lint-format-setup\ndigest=${digest}\n`;}
function applySetup(target, proposal, approval) {
  if (proposal.action === 'preserve' || proposal.action === 'skip') return {status:proposal.action};
  if (approval === null) return {status:'declined'};
  const {digest,...body} = proposal;
  if (body.kind !== 'lint-format-setup' || sha256(canonical(body)) !== digest) throw new Error('setup proposal digest mismatch');
  const rebuilt = proposeSetup({target,...body});
  const {digest:rebuiltDigest} = rebuilt;
  // Recovery of pending writes accepts only the approved desired bytes. Fresh
  // stale proposals still refuse below; no unrelated plan receipt is accepted.
  const {readManifest} = require('./lifecycle');
  const records = readManifest(target).records;
  for (const row of body.writes) {
    if (!allowedPath(body.ecosystem,row.path)) throw new Error('invalid setup write scope');
    const live = fileBytes(target,row.path);
    const liveDigest = live === null ? null : sha256(live);
    const pending = records.findLast(r => r.path === row.path && r.setup_digest === digest);
    if (liveDigest !== row.preimage_digest && !(pending && liveDigest === sha256(row.content))) throw new Error(`stale setup preimage: ${row.path}`);
  }
  if (rebuiltDigest !== digest && !records.some(r => r.setup_digest === digest)) throw new Error('stale setup proposal');
  if (!approval || typeof approval.identity !== 'string' || typeof approval.signature !== 'string') throw new Error('separate setup approval required');
  verifySshsig({allowedSigners:containedPath(target,'.rig/allowed-signers'),identity:approval.identity,namespace:'rig-lint-format-setup',message:approvalMessage(digest),signature:approval.signature});
  const {journalWriter} = require('./payload');
  fileBytes(target,'.rig/install-manifest.jsonl');
  for (const row of body.writes) {
    const backup = fileBytes(target,`.rig/preimages/${row.preimage_digest || 'setup-absence'}`);
    if (backup && sha256(backup) !== row.preimage_digest) throw new Error(`corrupt setup preimage: ${row.path}`);
  }
  const writer = journalWriter(target,{transactionOwner:digest});
  for (const row of body.writes) {
    const origin = records.find(r => r.path === row.path && r.ownership === 'lint_format_config');
    writer(target,row.path,row.content,null,'lint_format_config',{setup_digest:digest,setup_ecosystem:body.ecosystem,setup_original_digest:origin ? (origin.setup_original_digest !== undefined ? origin.setup_original_digest : origin.preimage_digest) : row.preimage_digest});
  }
  writer.finish();
  return {status:'applied',digest,paths:body.writes.map(r => r.path)};
}
function recoverSetup(target, records) {
  const removed = [], conflicts = [], handled = [], protectedPaths = [];
  for (const record of records.filter(r => r.ownership === 'lint_format_config')) {
    handled.push(record.path);
    const originalDigest = record.setup_original_digest !== undefined ? record.setup_original_digest : record.preimage_digest;
    const backup = typeof originalDigest === 'string' && /^[a-f0-9]{64}$/.test(originalDigest)
      ? `.rig/preimages/${originalDigest}` : null;
    try {
      if (!allowedPath(record.setup_ecosystem,record.path) || !/^[a-f0-9]{64}$/.test(record.setup_digest || '')) throw new Error('invalid typed setup record');
      const live = fileBytes(target,record.path);
      const liveDigest = live === null ? null : sha256(live);
      if (liveDigest === originalDigest) {removed.push(record.path); continue;}
      if (liveDigest !== (record.digest || record.desired_digest)) throw new Error('edited config');
      const abs = containedPath(target,record.path);
      if (originalDigest === null) fs.unlinkSync(abs);
      else {
        if (!backup) throw new Error('invalid preimage');
        const original = fileBytes(target,backup);
        if (!original || sha256(original) !== originalDigest) throw new Error('missing preimage');
        fs.writeFileSync(abs,original);
      }
      removed.push(record.path);
    } catch {
      conflicts.push(record.path);
      if (backup) protectedPaths.push(backup);
    }
  }
  return {removed,conflicts,handled,protectedPaths};
}
module.exports = {proposeSetup,applySetup,approvalMessage,recoverSetup};
