const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { listVendoredSkills } = require('./skills');
const { discoverHosts, REGISTRY } = require('./host-capabilities');
const { containedPath } = require('./path-safety');
const { parseJournalRecords } = require('./lifecycle');

const ROOT = path.join(__dirname, '..', '..');
// Antigravity co-reads `.agents/skills` natively and also gets `.rig/skills` as
// the instruction-only fallback (same gate as cursor/gemini/etc.).
const INSTRUCTION_ONLY = [
  'cursor', 'windsurf', 'cline', 'kiro', 'gemini', 'copilot', 'antigravity',
];
const PAYLOAD_HOSTS = [
  'claude', 'codex', 'antigravity', 'cursor', 'windsurf', 'cline', 'kiro', 'gemini', 'copilot',
];
const MANIFEST_REL = '.rig/install-manifest.jsonl';

function loadCanonicalManifest() {
  return JSON.parse(fs.readFileSync(path.join(ROOT, 'rig', 'manifest.json'), 'utf8'));
}

function directWrite(target, rel, contents, mode) {
  const dst = containedPath(target, rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true });
  fs.writeFileSync(dst, contents, mode ? { mode } : undefined);
  if (mode) fs.chmodSync(dst, mode);
}

function copyOp(target, from, to, writeFile = directWrite) {
  const src = path.join(ROOT, from);
  writeFile(target, to, fs.readFileSync(src), fs.statSync(src).mode & 0o777);
}

function seedUserFile(target, from, to, writeFile = directWrite) {
  const dst = containedPath(target, to);
  if (fs.existsSync(dst)) return;
  const src = path.join(ROOT, from);
  writeFile(target, to, fs.readFileSync(src), fs.statSync(src).mode & 0o777, 'user_owned', {
    transaction_kind: 'user_seed',
  });
}

// Build inputs and working notes never ship: the rendered SKILL.md is the
// product; .tmpl is its source; TODOS-format.md is a dev file.
function isLitter(srcAbs) {
  return srcAbs.endsWith('.tmpl') || path.basename(srcAbs) === 'TODOS-format.md';
}

function copyTree(target, srcAbs, dstRel, writeFile, transform, filter) {
  const stat = fs.statSync(srcAbs);
  if (stat.isDirectory()) {
    for (const entry of fs.readdirSync(srcAbs)) {
      copyTree(target, path.join(srcAbs, entry), path.join(dstRel, entry), writeFile, transform, filter);
    }
  } else {
    if (filter && !filter(srcAbs)) return;
    const source = fs.readFileSync(srcAbs);
    const contents = transform ? transform(srcAbs, source) : source;
    writeFile(target, dstRel, contents, stat.mode & 0o777);
  }
}

function copyTreeOp(target, from, to, writeFile = directWrite) {
  copyTree(target, path.join(ROOT, from), to, writeFile);
}

function ensureLine(target, to, line, writeFile = directWrite) {
  const file = containedPath(target, to);
  const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (body.split('\n').includes(line)) return;
  const separator = body && !body.endsWith('\n') ? '\n' : '';
  writeFile(target, to, `${body}${separator}${line}\n`, undefined, 'append_managed', { managed_line: line });
}

// Rewrite the frontmatter `name:` line so a skill installed under
// `rig-<name>/` also identifies itself as `rig-<name>` — Claude and Codex
// discover skills by that frontmatter field and it must match the directory
// so calling it by its Rig name resolves to this file. The rewrite is bounded
// to the first `name:` line inside the leading `---` block; nothing else in
// the SKILL.md is touched. Upstream MIT permits this modification and the
// modified-partial-distribution notice ships alongside.
function rewriteSkillName(body, prefix, declared) {
  return body.replace(
    /^(---\n(?:(?!---\n)[^\n]*\n)*?name:\s*)[^\n]+/m,
    (_m, head) => `${head}${prefix}${declared}`,
  );
}

function installVendoredSkillsOp(target, entry, writeFile = directWrite, activeDelivery = false) {
  const skills = listVendoredSkills();
  const destPattern = entry.destination;
  const prefix = entry.rewrite_name_prefix || '';
  const filter = (srcAbs) => {
    if (isLitter(srcAbs)) return false;
    if (activeDelivery) return true;
    return srcAbs.endsWith('.md'); // default install = markdown only
  };
  for (const skill of skills) {
    const src = path.join(ROOT, 'rig', 'catalog', 'skills', skill.dir);
    const finalName = `${prefix}${skill.name}`;
    const rel = destPattern.replace('{name}', finalName);
    const skillMd = path.join(src, 'SKILL.md');
    copyTree(target, src, rel, writeFile, (sourcePath, contents) => {
      // Always align the frontmatter with the installed directory: a source
      // SKILL.md may declare a name that lost the tie-break in
      // listVendoredSkills, and a mismatch is invisible-broken on native hosts.
      if (sourcePath !== skillMd) return contents;
      return rewriteSkillName(contents.toString('utf8'), prefix, skill.name);
    }, filter);
  }
}

function sha256(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}

function journalWriter(target) {
  const manifest = containedPath(target, MANIFEST_REL);
  const records = fs.existsSync(manifest)
    ? parseJournalRecords(fs.readFileSync(manifest, 'utf8'))
    : [];
  let seq = records.reduce((max, record) => Math.max(max, record.seq || 0), 0);
  const latestByPath = new Map();
  let transactionStarted = false;
  for (const record of records) {
    if (Number.isInteger(record.seq) && record.path) latestByPath.set(record.path, record);
  }

  const append = (record) => {
    fs.mkdirSync(path.dirname(manifest), { recursive: true });
    fs.appendFileSync(manifest, `${JSON.stringify(record)}\n`);
  };

  const start = () => {
    if (transactionStarted) return;
    append({ kind: 'install_state', complete: false });
    transactionStarted = true;
  };

  const write = (ignoredTarget, rel, contents, mode, ownershipOverride, details = {}) => {
    const abs = containedPath(target, rel);
    const desired = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
    const before = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
    const currentMode = fs.existsSync(abs) ? fs.statSync(abs).mode & 0o777 : null;
    const desiredDigest = sha256(desired);
    const prior = latestByPath.get(rel);
    if (prior?.state === 'applied' && prior.digest === desiredDigest && before?.equals(desired) && (!mode || currentMode === mode)) return;

    const ownership = ownershipOverride || (before ? 'replace_owned' : 'create_owned');
    let record;
    if (prior?.state === 'pending') {
      if (prior.desired_digest !== desiredDigest) throw new Error(`rig: changed pending payload write: ${rel}`);
      const currentDigest = before ? sha256(before) : null;
      if (currentDigest === desiredDigest) {
        start();
        const applied = { ...prior, state: 'applied', digest: desiredDigest };
        append(applied);
        latestByPath.set(rel, applied);
        return;
      }
      if (currentDigest !== (prior.preimage_digest || null)) {
        throw new Error(`rig: conflicting pending payload write: ${rel}`);
      }
      record = prior;
    } else {
      const preimageDigest = before ? sha256(before) : null;
      if (before) {
        write(target, `.rig/preimages/${preimageDigest}`, before, 0o600);
      }
      record = {
        seq: ++seq,
        path: rel,
        ownership,
        operation: ownership,
        transaction_kind: 'install',
        state: 'pending',
        preimage_digest: preimageDigest,
        desired_digest: desiredDigest,
        mode: mode || null,
        ...details,
      };
      start();
      append(record);
    }
    start();
    directWrite(target, rel, desired, mode);
    const applied = {
      ...record,
      state: 'applied',
      digest: desiredDigest,
    };
    append(applied);
    latestByPath.set(rel, applied);
  };
  write.begin = () => {};
  write.finish = () => {
    if (transactionStarted) append({ kind: 'install_state', complete: true });
  };
  write.appliedCount = () => [...latestByPath.values()].filter((record) => record.state === 'applied').length;
  return write;
}

// `host` may be a string, or an array of hosts that share one payload entry.
function hostSelected(entryHost, selected) {
  if (entryHost === 'neutral') return true;
  const hosts = Array.isArray(entryHost) ? entryHost : [entryHost];
  return hosts.some((host) => selected.includes(host));
}

function runPayload(target, hosts, { releaseTag, activeDelivery = false } = {}) {
  const hostEntries = hosts === undefined
    ? discoverHosts(target)
    : [...new Set(hosts)].map((id) => {
      if (!REGISTRY[id]) throw new Error(`rig: unknown host "${id}"`);
      return { id, provenance: 'explicit', marker_paths: [] };
    });
  const selected = hostEntries.map((entry) => entry.id);
  const instructionOnly = INSTRUCTION_ONLY.some((host) => selected.includes(host));
  const writeFile = journalWriter(target);
  const writesBefore = writeFile.appliedCount();
  writeFile.begin();
  for (const entry of loadCanonicalManifest().payload) {
    if (!hostSelected(entry.host, selected)) continue;
    if (entry.gate === 'instruction_only_selected' && !instructionOnly) continue;
    if (entry.gate === 'active_delivery' && !activeDelivery) continue;
    if (entry.op === 'copy') copyOp(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'seed_user_file') seedUserFile(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'copy_tree') copyTreeOp(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'install_vendored_skills') installVendoredSkillsOp(target, entry, writeFile, activeDelivery);
    else if (entry.op === 'ensure_line') ensureLine(target, entry.to, entry.line, writeFile);
  }
  if (releaseTag) {
    writeFile(target, '.rig/release.json', `${JSON.stringify({ tag: releaseTag }, null, 2)}\n`);
  }
  writeFile.finish();
  return { hosts: hostEntries, writes: writeFile.appliedCount() - writesBefore };
}

module.exports = {
  ROOT, INSTRUCTION_ONLY, PAYLOAD_HOSTS,
  MANIFEST_REL, loadCanonicalManifest, copyOp, copyTreeOp, seedUserFile, ensureLine, hostSelected, journalWriter, runPayload,
};
