const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { listVendoredSkills } = require('./skills');
const { discoverHosts, REGISTRY, INSTRUCTION_ONLY_HOSTS, SCAN_ROOTS, INSTRUCTION_FILE_HOSTS } = require('./host-capabilities');
const { containedPath } = require('./path-safety');

const ROOT = path.join(__dirname, '..', '..');
// Instruction-only hosts: rely on `.rig/skills/` as their Rig-managed skill-discovery
// path. Sourced from the host registry so the list is maintained in one place.
// Antigravity co-reads `.agents/skills` natively and also gets `.rig/skills` as
// the instruction-only fallback (same gate as cursor/gemini/etc.).
const INSTRUCTION_ONLY = [...INSTRUCTION_ONLY_HOSTS];
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
  if (path.basename(srcAbs) === 'node_modules') return;
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
  copyTree(target, path.join(ROOT, from), to, writeFile, undefined, (srcAbs) => !isLitter(srcAbs));
}

// The release-pinned skill catalogue. Rig owns `.rig/catalog.json`, so a copy
// that no longer matches its own journal receipt was edited by the user: that
// conflicts rather than being silently overwritten (F-3 §5.2).
function installPinnedCatalogOp(target, from, to, writeFile = directWrite) {
  const pinned = fs.readFileSync(path.join(ROOT, from));
  const dst = containedPath(target, to);
  if (fs.existsSync(dst)) {
    const current = fs.readFileSync(dst);
    if (!current.equals(pinned)) {
      const receipt = writeFile.latest ? writeFile.latest(to) : null;
      if (!receipt || receipt.digest !== sha256(current)) {
        throw new Error(`rig: ${to} was edited after install; the pinned catalog conflicts with it (no clean receipt)`);
      }
    }
  }
  writeFile(target, to, pinned, 0o644);
}

function ensureGitignoreBlock(target, lines, writeFile = directWrite) {
  const file = containedPath(target, '.gitignore');
  const body = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
  if (body.includes('# rig:gitignore:start')) return;
  const block = `# rig:gitignore:start\n${lines.join('\n')}\n# rig:gitignore:end\n`;
  const separator = body && !body.endsWith('\n') ? '\n' : '';
  writeFile(target, '.gitignore', `${body}${separator}${block}`, undefined, 'append_managed', { managed_block: 'gitignore' });
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
    const src = path.join(ROOT, path.dirname(skill.source_rel));
    const effectivePrefix = (prefix && skill.name === prefix.replace(/-$/, '')) ? '' : prefix;
    const finalName = `${effectivePrefix}${skill.name}`;
    const rel = destPattern.replace('{name}', finalName);
    const skillMd = path.join(src, 'SKILL.md');
    copyTree(target, src, rel, writeFile, (sourcePath, contents) => {
      // Always align the frontmatter with the installed directory so native
      // hosts never receive a source/directory name mismatch.
      if (sourcePath !== skillMd) return contents;
      return rewriteSkillName(contents.toString('utf8'), effectivePrefix, skill.name);
    }, filter);
  }
}

function sha256(contents) {
  return crypto.createHash('sha256').update(contents).digest('hex');
}

const GRAFT_CAPABILITY = '[a-z0-9]+(?:-[a-z0-9]+)*(?:\\.[a-z0-9]+(?:-[a-z0-9]+)*)+';
const GRAFT_OPEN = new RegExp(`^<!-- rig:graft capability="(${GRAFT_CAPABILITY})" version="([0-9]+)" begin -->$`);
const GRAFT_CLOSE = new RegExp(`^<!-- rig:graft capability="(${GRAFT_CAPABILITY})" end -->$`);

function graftFail(message) {
  throw new Error(`rig: graft ${message}`);
}

function utf8(source) {
  const bytes = Buffer.isBuffer(source) ? source : Buffer.from(source);
  try {
    return { bytes, text: new TextDecoder('utf-8', { fatal: true }).decode(bytes) };
  } catch {
    graftFail('source is not valid UTF-8');
  }
}

function graftLines(text) {
  const lines = [];
  let charStart = 0;
  let byteStart = 0;
  while (charStart < text.length) {
    const newlineAt = text.indexOf('\n', charStart);
    const hasNewline = newlineAt !== -1;
    const charEnd = hasNewline ? newlineAt : text.length;
    const crlf = hasNewline && newlineAt > charStart && text[newlineAt - 1] === '\r';
    const bodyEnd = crlf ? newlineAt - 1 : charEnd;
    const line = text.slice(charStart, bodyEnd);
    const eol = hasNewline ? (crlf ? '\r\n' : '\n') : '';
    const end = byteStart + Buffer.byteLength(`${line}${eol}`);
    lines.push({ line, start: byteStart, end, eol });
    byteStart = end;
    charStart = hasNewline ? newlineAt + 1 : text.length;
  }
  return lines;
}

function canonicalGraftContent(content) {
  const lines = String(content).replace(/\r\n/g, '\n').split('\n');
  while (lines.length && !lines[0].trim()) lines.shift();
  while (lines.length && !lines.at(-1).trim()) lines.pop();
  return lines.join('\n');
}

function parseGraftSections(source) {
  const { bytes, text } = utf8(source);
  const lines = graftLines(text);
  const newline = lines.find(({ eol }) => eol)?.eol || '\n';
  const sections = [];
  const seen = new Set();
  let active = null;
  for (const row of lines) {
    if (!row.line.includes('<!-- rig:graft')) continue;
    const open = row.line.match(GRAFT_OPEN);
    const close = row.line.match(GRAFT_CLOSE);
    if (!open && !close) graftFail('has malformed marker');
    if (open) {
      if (active) graftFail('has nested marker');
      const [, capability, versionText] = open;
      if (versionText !== '1') graftFail(`has unsupported version "${versionText}"`);
      if (seen.has(capability)) graftFail(`duplicates capability "${capability}"`);
      active = { capability, version: 1, start: row.start, contentStart: row.end };
      continue;
    }
    if (!active) graftFail('has orphan close marker');
    if (close[1] !== active.capability) graftFail('has mismatched marker capability');
    const content = canonicalGraftContent(utf8(bytes.subarray(active.contentStart, row.start)).text);
    sections.push({
      capability: active.capability,
      version: active.version,
      start: active.start,
      end: row.end,
      content,
      content_digest: sha256(content),
    });
    seen.add(active.capability);
    active = null;
  }
  if (active) graftFail('has unterminated marker');
  return { newline, sections };
}

function isGraftMarkdownPath(rel) {
  const extension = path.extname(rel).toLowerCase();
  if (['.md', '.mdx', '.mdc'].includes(extension)) return true;
  return !extension && new Set(['AGENTS', 'CLAUDE', 'GEMINI', 'INSTRUCTIONS']).has(path.basename(rel));
}

function assertGraftTarget(target, rel) {
  if (typeof rel !== 'string' || !isGraftMarkdownPath(rel)) {
    graftFail('target has an unsupported Markdown file type');
  }
  const file = containedPath(target, rel);
  if (!fs.existsSync(file)) return file;
  const stat = fs.lstatSync(file);
  if (stat.isSymbolicLink()) graftFail('target is a symlink');
  if (stat.isFile() && stat.nlink > 1) graftFail('target has a hard link');
  return file;
}

function assertGraftArgs(args) {
  if (!args || typeof args !== 'object' || typeof args.capability !== 'string'
    || !new RegExp(`^${GRAFT_CAPABILITY}$`).test(args.capability) || args.version !== 1
    || typeof args.content !== 'string' || (args.expected_file_digest !== null && typeof args.expected_file_digest !== 'string')) {
    graftFail('arguments are invalid');
  }
  if (args.content.includes('<!-- rig:graft')) graftFail('content contains a graft marker');
}

function managedGraftDetails(sections, previous, separatorCaps) {
  return {
    managed_grafts: sections.map(({ capability, version, content_digest }) => ({ capability, version, content_digest }))
      .sort((a, b) => a.capability.localeCompare(b.capability)),
    graft_separators: [...separatorCaps].sort(),
    // The separator ledger is intentionally separate: managed_grafts is the
    // stable ownership contract; this only restores a no-final-newline file.
  };
}

// The digest of the bytes an interrupted run was putting at `rel`.
//
// A crash between the disk write and the journal record that says so leaves the
// desired bytes live with nothing recording them. A preflight comparing the
// file against the proposal's preimage then reads that as "someone changed this
// under us" and refuses forever, when it is really Rig's own half-finished
// work. This is offered only while the journal still has an open transaction,
// so a cleanly finished earlier install can never be used to excuse a proposal
// built on a stale view of the file. A pending delete is excluded: its desired
// end state is absence, not bytes, and `resolvePendingDelete` owns that.
function journalResumeDigest(writeFile, rel) {
  if (typeof writeFile?.interrupted !== 'function' || !writeFile.interrupted()) return null;
  const prior = writeFile.latest?.(rel);
  if (!prior || prior.operation === 'delete_owned') return null;
  return prior.desired_digest || null;
}

// Re-issue a write whose bytes are already live so the writer can append the
// `applied` record that the interrupted run never got to. `write` recognises a
// pending record whose desired bytes match the file and promotes it without
// touching disk, so nothing is rewritten and the extra arguments go unread.
// Without this, a resumed run would leave the path pending forever — the
// journal would keep claiming an unfinished write that has in fact landed.
function resumeLandedWrite(target, rel, bytes, writeFile) {
  const prior = writeFile.latest?.(rel);
  if (prior?.state !== 'pending' || prior.operation === 'delete_owned') return false;
  if (prior.desired_digest !== sha256(bytes)) return false;
  writeFile(target, rel, bytes, undefined, prior.ownership);
  return true;
}

function upsertGraftSection(target, args, writeFile) {
  assertGraftArgs(args);
  if (typeof writeFile !== 'function') graftFail('writer is required');
  const file = assertGraftTarget(target, args.path);
  const current = fs.existsSync(file) ? fs.readFileSync(file) : Buffer.alloc(0);
  const currentDigest = current.length ? sha256(current) : null;
  const resumeDigest = current.length ? journalResumeDigest(writeFile, args.path) : null;
  if (currentDigest !== args.expected_file_digest && !(resumeDigest && currentDigest === resumeDigest)) {
    graftFail('has stale file digest or preimage');
  }
  const parsed = parseGraftSections(current);
  const desiredContent = canonicalGraftContent(args.content);
  const existing = parsed.sections.find(({ capability }) => capability === args.capability);
  if (existing && existing.content === desiredContent) {
    resumeLandedWrite(target, args.path, current, writeFile);
    return { changed: false, action: 'noop', file_digest: sha256(current) };
  }
  const content = desiredContent.split('\n').join(parsed.newline);
  const open = `<!-- rig:graft capability="${args.capability}" version="1" begin -->`;
  const close = `<!-- rig:graft capability="${args.capability}" end -->`;
  const block = Buffer.from(`${open}${parsed.newline}${content}${parsed.newline}${close}${parsed.newline}`);
  const separatorAdded = current.length > 0 && !current.toString('utf8').endsWith('\n');
  const next = existing
    ? Buffer.concat([current.subarray(0, existing.start), block, current.subarray(existing.end)])
    : Buffer.concat([current, ...(separatorAdded ? [Buffer.from(parsed.newline)] : []), block]);
  const nextParsed = parseGraftSections(next);
  const separatorCaps = new Set(writeFile.latest?.(args.path)?.graft_separators || []);
  if (!existing && separatorAdded) separatorCaps.add(args.capability);
  writeFile(target, args.path, next, undefined, 'graft_managed', managedGraftDetails(nextParsed.sections, writeFile.latest?.(args.path), separatorCaps));
  return { changed: true, action: existing ? 'update' : 'create', file_digest: sha256(next) };
}

function removeGraftSection(target, args, writeFile) {
  if (!args || typeof args !== 'object' || typeof args.capability !== 'string'
    || !new RegExp(`^${GRAFT_CAPABILITY}$`).test(args.capability)
    || (args.expected_file_digest !== null && typeof args.expected_file_digest !== 'string')) {
    graftFail('arguments are invalid');
  }
  if (typeof writeFile !== 'function') graftFail('writer is required');
  const file = assertGraftTarget(target, args.path);
  if (!fs.existsSync(file)) return { changed: false, action: 'noop', file_digest: null };
  const current = fs.readFileSync(file);
  const currentDigest = sha256(current);
  const resumeDigest = journalResumeDigest(writeFile, args.path);
  if (currentDigest !== args.expected_file_digest && !(resumeDigest && currentDigest === resumeDigest)) {
    graftFail('has stale file digest or preimage');
  }
  const parsed = parseGraftSections(current);
  const existing = parsed.sections.find(({ capability }) => capability === args.capability);
  if (!existing) {
    resumeLandedWrite(target, args.path, current, writeFile);
    return { changed: false, action: 'noop', file_digest: currentDigest };
  }
  const previous = writeFile.latest?.(args.path);
  const separatorCaps = new Set(previous?.graft_separators || []);
  const separator = Buffer.from(parsed.newline);
  const separatorStart = separatorCaps.has(args.capability)
    && existing.start >= separator.length
    && current.subarray(existing.start - separator.length, existing.start).equals(separator)
    ? existing.start - separator.length
    : existing.start;
  const next = Buffer.concat([current.subarray(0, separatorStart), current.subarray(existing.end)]);
  const nextParsed = parseGraftSections(next);
  separatorCaps.delete(args.capability);
  // The last managed section left and nothing else was in the file. If the file
  // exists only because Rig grafted it, restore absence rather than leaving a
  // zero-byte husk; otherwise keep the (now empty) repository-owned file and say
  // so — file_digest is the digest of the empty file, not null.
  if (next.length === 0 && typeof writeFile.remove === 'function'
    && writeFile.remove(target, args.path, sha256(current)).removed) {
    return { changed: true, action: 'remove', file_digest: null };
  }
  writeFile(target, args.path, next, undefined, 'graft_managed', managedGraftDetails(nextParsed.sections, previous, separatorCaps));
  return { changed: true, action: 'remove', file_digest: sha256(next) };
}

function walkAllFiles(root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) walkAllFiles(file, out);
    else if (entry.isFile()) out.push(file);
  }
  return out;
}

// Enumerate every live Rig graft marker found in any supported instruction
// surface of the repository. Returns an array of
// { rel, capability, version, content_digest } tuples.
// Malformed-graft files are skipped here; projectionFailures / reconcileApplied
// report those separately.
function enumerateGraftMarkers(target) {
  const realTarget = fs.realpathSync(target);
  const visited = new Set();
  const markers = [];

  function scanRel(rel) {
    if (visited.has(rel)) return;
    visited.add(rel);
    if (!isGraftMarkdownPath(rel)) return;
    const file = containedPath(target, rel);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return;
    let sections;
    try {
      sections = parseGraftSections(fs.readFileSync(file)).sections;
    } catch {
      return; // malformed; reported elsewhere
    }
    for (const { capability, version, content_digest } of sections) {
      markers.push({ rel, capability, version, content_digest });
    }
  }

  // Fixed instruction files (CLAUDE.md, AGENTS.md, GEMINI.md, …)
  for (const rel of Object.keys(INSTRUCTION_FILE_HOSTS)) {
    scanRel(rel);
  }

  // All files inside the registry-driven scan roots (.cursor/skills, .agents/skills, …)
  for (const { root: rootRel } of SCAN_ROOTS) {
    const root = path.join(realTarget, rootRel);
    for (const file of walkAllFiles(root)) {
      const rel = path.relative(realTarget, file).split(path.sep).join('/');
      scanRel(rel);
    }
  }

  return markers;
}

function journalWriter(target) {
  const manifest = containedPath(target, MANIFEST_REL);
  const records = fs.existsSync(manifest)
    ? fs.readFileSync(manifest, 'utf8').split('\n').flatMap((line) => {
      if (!line.trim()) return [];
      try { return [JSON.parse(line)]; } catch { return []; }
    })
    : [];
  let seq = records.reduce((max, record) => Math.max(max, record.seq || 0), 0);
  const latestByPath = new Map();
  // Ownership of a path is decided by the record that first put bytes there,
  // not the newest one: every write after the first carries a preimage, so the
  // latest record cannot distinguish "Rig created this" from "Rig replaced it".
  // An applied delete ends that lineage — the path is free again, and whatever
  // writes it next is its new origin.
  const originByPath = new Map();
  const trackOrigin = (record) => {
    if (record.operation === 'delete_owned' && record.state === 'applied') originByPath.delete(record.path);
    else if (!originByPath.has(record.path)) originByPath.set(record.path, record);
  };
  let transactionStarted = false;
  // An `install_state` record opened with complete:false and never closed means
  // a previous run died mid-transaction. That, and only that, licenses a
  // preflight to read live bytes matching the journal as this installer's own
  // unfinished work rather than as an edit it must refuse.
  let interrupted = false;
  for (const record of records) {
    if (record.kind === 'install_state') {
      interrupted = record.complete !== true;
      continue;
    }
    if (!Number.isInteger(record.seq) || !record.path) continue;
    latestByPath.set(record.path, record);
    trackOrigin(record);
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

  // An interrupted journalled delete leaves a pending delete_owned record as the
  // path's newest entry. Both halves are recoverable without guessing: absence
  // means the unlink landed and only the applied record was lost, and an
  // untouched preimage means the unlink never ran. Any other bytes are a real
  // conflict — someone else owns the path now — so refuse instead of deleting.
  const resolvePendingDelete = (rel, abs) => {
    const prior = latestByPath.get(rel);
    if (!prior || prior.operation !== 'delete_owned' || prior.state !== 'pending') return false;
    start();
    if (fs.existsSync(abs)) {
      if (sha256(fs.readFileSync(abs)) !== (prior.preimage_digest || null)) {
        throw new Error(`rig: conflicting pending payload delete: ${rel}`);
      }
      fs.unlinkSync(abs);
    }
    const applied = { ...prior, state: 'applied', digest: null };
    append(applied);
    latestByPath.set(rel, applied);
    trackOrigin(applied);
    return true;
  };

  const write = (ignoredTarget, rel, contents, mode, ownershipOverride, details = {}) => {
    const abs = containedPath(target, rel);
    resolvePendingDelete(rel, abs);
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
        trackOrigin(applied);
        return;
      }
      if (currentDigest !== (prior.preimage_digest || null)) {
        throw new Error(`rig: conflicting pending payload write: ${rel}`);
      }
      record = prior;
    } else {
      const preimageDigest = before ? sha256(before) : null;
      if (before) {
        const preimageRel = `.rig/preimages/${preimageDigest}`;
        const preimage = containedPath(target, preimageRel);
        fs.mkdirSync(path.dirname(preimage), { recursive: true });
        if (!fs.existsSync(preimage)) {
          fs.writeFileSync(preimage, before, { mode: 0o600 });
          start();
          const preimageRecord = {
            seq: ++seq,
            path: preimageRel,
            ownership: 'create_owned',
            operation: 'create_owned',
            transaction_kind: 'install',
            state: 'applied',
            digest: preimageDigest,
            desired_digest: preimageDigest,
          };
          append(preimageRecord);
          latestByPath.set(preimageRel, preimageRecord);
          trackOrigin(preimageRecord);
        }
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
    trackOrigin(applied);
  };
  // Journalled delete. Absence is a state Rig can only restore for a path it
  // created — read from the path's origin record, since every graft after the
  // first leaves a preimage on the newest one. If the file existed before Rig
  // touched it, unlinking would destroy repository-owned bytes, so the caller
  // keeps the (possibly empty) file and reports that honestly instead. Both
  // halves of the delete are journalled — pending before the unlink, applied
  // after — and `resolvePendingDelete` recovers either interruption.
  const remove = (ignoredTarget, rel, expectedDigest) => {
    const abs = containedPath(target, rel);
    if (resolvePendingDelete(rel, abs)) return { removed: true };
    const prior = latestByPath.get(rel);
    if (prior?.operation === 'delete_owned' && prior.state === 'applied' && !fs.existsSync(abs)) {
      return { removed: true };
    }
    const origin = originByPath.get(rel);
    if (!origin || origin.preimage_digest !== null) return { removed: false, reason: 'preexisting' };
    const liveDigest = fs.existsSync(abs) ? sha256(fs.readFileSync(abs)) : null;
    if (liveDigest !== null && expectedDigest && liveDigest !== expectedDigest && liveDigest !== prior?.desired_digest) {
      throw new Error(`rig: refusing to delete ${rel}: live bytes do not match expected`);
    }
    start();
    const pending = {
      seq: ++seq,
      path: rel,
      ownership: 'delete_owned',
      operation: 'delete_owned',
      transaction_kind: 'install',
      state: 'pending',
      // The bytes being removed, so a recovering writer can prove the unlink
      // never ran rather than guessing at a path someone else has since taken.
      preimage_digest: liveDigest,
      desired_digest: null,
    };
    append(pending);
    if (liveDigest !== null) fs.unlinkSync(abs);
    const applied = { ...pending, state: 'applied', digest: null };
    append(applied);
    latestByPath.set(rel, applied);
    trackOrigin(applied);
    return { removed: true };
  };

  write.begin = () => {};
  write.remove = remove;
  write.latest = (rel) => latestByPath.get(rel) || null;
  write.interrupted = () => interrupted;
  // Closing also settles a transaction this writer only inherited. A run that
  // resumes an interrupted install may find every desired byte already in place
  // and write nothing; without this the journal would stay open forever and
  // keep handing later runs a resume licence they have not earned.
  write.finish = () => {
    if (!transactionStarted && !interrupted) return;
    append({ kind: 'install_state', complete: true });
    transactionStarted = false;
    interrupted = false;
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

function runPayload(target, hosts, { releaseTag, activeDelivery = false, afterPayload = null } = {}) {
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
    // The adaptive (Path B) install projects only the mandatory skills into
    // host discovery and stages the rest under .rig/runtime for an approved
    // selective projection. The legacy markdown-only install keeps its fan-out.
    if (entry.gate === 'default_delivery' && activeDelivery) continue;
    // The neutral optional-skill fan-out is suppressed for instruction-only
    // hosts in adaptive mode: they must see only the 8 mandatory skills before
    // approval (AC-T3).  Bare installs (no hosts) and legacy installs are
    // unaffected: instructionOnly is false when no hosts are selected, and
    // activeDelivery is false in legacy mode.
    if (entry.gate === 'suppress_on_instruction_only_adaptive' && instructionOnly && activeDelivery) continue;
    if (entry.op === 'copy') copyOp(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'seed_user_file') seedUserFile(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'copy_tree') copyTreeOp(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'install_pinned_catalog') installPinnedCatalogOp(target, entry.from, entry.to, writeFile);
    else if (entry.op === 'install_vendored_skills') installVendoredSkillsOp(target, entry, writeFile, activeDelivery);
    else if (entry.op === 'ensure_line') ensureLine(target, entry.to, entry.line, writeFile);
    else if (entry.op === 'ensure_gitignore_block') ensureGitignoreBlock(target, entry.lines, writeFile);
  }
  if (releaseTag) {
    const installedHostIds = [...new Set(selected)].sort();
    writeFile(target, '.rig/release.json', `${JSON.stringify({ tag: releaseTag, hosts: installedHostIds }, null, 2)}\n`);
  }
  if (afterPayload) afterPayload({ writeFile });
  writeFile.finish();
  return { hosts: hostEntries, writes: writeFile.appliedCount() - writesBefore };
}

module.exports = {
  ROOT, INSTRUCTION_ONLY, PAYLOAD_HOSTS,
  MANIFEST_REL, loadCanonicalManifest, copyOp, copyTreeOp, seedUserFile, ensureGitignoreBlock, ensureLine, hostSelected, journalResumeDigest, journalWriter, parseGraftSections, upsertGraftSection, removeGraftSection, runPayload, enumerateGraftMarkers,
};
