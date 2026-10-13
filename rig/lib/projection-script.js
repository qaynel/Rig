// Agent-written projection scripts for hosts the corpus has no projector for.
//
// The user's agent reads rig/corpus/onboarding/unpack.md, writes a
// deterministic script, and proposes it in the onboarding proposal's
// `projection_script` slot. Nothing here infers anything: this module only
// (1) validates the slot the agent proposed, (2) refuses to execute unless a
// verified filesystem+network sandbox exists, (3) runs the approved bytes with
// the repository read-only and a dedicated output directory, and (4) validates
// every artifact the script produced against the approved paths, sizes and
// containment before the caller writes anything through the journal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { detectSandboxSync, runSandboxed } = require('./sandbox');

const SLOT_KEYS = new Set(['host', 'source', 'script_digest', 'approved_outputs', 'limits']);
const OUTPUT_KEYS = new Set(['path', 'max_bytes', 'preimage_digest', 'content_digest']);
const LIMIT_KEYS = new Set(['timeout_ms']);
const MAX_SOURCE_BYTES = 256 * 1024;
const MAX_OUTPUTS = 64;
const MAX_OUTPUT_BYTES = 1024 * 1024;
const DEFAULT_TIMEOUT_MS = 20000;
const MAX_TIMEOUT_MS = 60000;
const HOST_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;
const DIGEST_RE = /^[0-9a-f]{64}$/;
// Paths a script may never target, whatever the approval says: Rig's own state
// and signer list, git internals, and secret files.
const RESERVED = [/^\.rig(\/|$)/, /^\.git(\/|$)/, /(^|\/)\.env($|\.)/, /(^|\/)node_modules(\/|$)/];

class ScriptRefusal extends Error {
  constructor(code, detail) {
    super(`rig: projection script refused (${code}): ${detail}`);
    this.code = code;
  }
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function refuse(code, detail) {
  throw new ScriptRefusal(code, detail);
}

function exactKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) refuse('slot-invalid', `${label} is not an object`);
  for (const key of Object.keys(value)) if (!keys.has(key)) refuse('slot-invalid', `${label} has unknown key "${key}"`);
}

function safeOutputPath(rel) {
  if (typeof rel !== 'string' || !rel || rel.includes('\0') || rel.includes('\\') || path.posix.isAbsolute(rel) || /^[A-Za-z]:/.test(rel)) {
    refuse('slot-invalid', 'approved output path is invalid');
  }
  if (rel.split('/').some((part) => !part || part === '.' || part === '..')) refuse('slot-invalid', `approved output path "${rel}" is not a clean relative path`);
  if (RESERVED.some((pattern) => pattern.test(rel))) refuse('slot-invalid', `approved output path "${rel}" is reserved`);
  return rel;
}

function digestOrNull(value, label) {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'string' || !DIGEST_RE.test(value)) refuse('slot-invalid', `${label} is not a SHA-256 digest`);
  return value;
}

// Canonical form of the slot, with the script digest computed by the engine.
// A caller-supplied digest must agree; it is never trusted in place of the bytes.
function validateScriptSlot(slot) {
  exactKeys(slot, SLOT_KEYS, 'projection_script');
  if (typeof slot.host !== 'string' || !HOST_RE.test(slot.host)) refuse('slot-invalid', 'host must be a short lowercase name');
  if (typeof slot.source !== 'string' || !slot.source.trim()) refuse('slot-invalid', 'script source is required');
  if (Buffer.byteLength(slot.source) > MAX_SOURCE_BYTES) refuse('slot-invalid', `script source exceeds ${MAX_SOURCE_BYTES} bytes`);
  const scriptDigest = sha256(slot.source);
  if (slot.script_digest !== undefined && slot.script_digest !== scriptDigest) refuse('script-digest-mismatch', 'the supplied script digest does not match the script bytes');
  if (!Array.isArray(slot.approved_outputs) || slot.approved_outputs.length < 1 || slot.approved_outputs.length > MAX_OUTPUTS) {
    refuse('slot-invalid', `approved_outputs must list 1 to ${MAX_OUTPUTS} files`);
  }
  const seen = new Set();
  const outputs = slot.approved_outputs.map((row) => {
    exactKeys(row, OUTPUT_KEYS, 'approved output');
    const rel = safeOutputPath(row.path);
    if (seen.has(rel.toLowerCase())) refuse('slot-invalid', `approved output "${rel}" is listed twice`);
    seen.add(rel.toLowerCase());
    if (!Number.isInteger(row.max_bytes) || row.max_bytes < 1 || row.max_bytes > MAX_OUTPUT_BYTES) {
      refuse('slot-invalid', `approved output "${rel}" needs max_bytes between 1 and ${MAX_OUTPUT_BYTES}`);
    }
    return {
      path: rel,
      max_bytes: row.max_bytes,
      preimage_digest: digestOrNull(row.preimage_digest, 'preimage_digest'),
      content_digest: digestOrNull(row.content_digest, 'content_digest'),
    };
  }).sort((a, b) => a.path.localeCompare(b.path));
  let timeout = DEFAULT_TIMEOUT_MS;
  if (slot.limits !== undefined) {
    exactKeys(slot.limits, LIMIT_KEYS, 'limits');
    timeout = slot.limits.timeout_ms ?? DEFAULT_TIMEOUT_MS;
    if (!Number.isInteger(timeout) || timeout < 100 || timeout > MAX_TIMEOUT_MS) refuse('slot-invalid', `timeout_ms must be between 100 and ${MAX_TIMEOUT_MS}`);
  }
  return {
    host: slot.host,
    source: slot.source,
    script_digest: scriptDigest,
    approved_outputs: outputs,
    limits: { timeout_ms: timeout },
  };
}

// Walk the output directory without following anything: every entry must be a
// plain file or directory, so a symlink, hard link, FIFO or device is refused
// outright. File bytes are read only after the path, size and containment checks.
function collectArtifacts(outDir, slot) {
  const realOut = fs.realpathSync(outDir);
  const approved = new Map(slot.approved_outputs.map((row) => [row.path, row]));
  const found = new Map();
  const walk = (dir, prefix) => {
    for (const entry of fs.readdirSync(dir)) {
      const abs = path.join(dir, entry);
      const rel = prefix ? `${prefix}/${entry}` : entry;
      const stat = fs.lstatSync(abs);
      if (stat.isDirectory()) { walk(abs, rel); continue; }
      if (!stat.isFile()) refuse('artifact-not-regular', `"${rel}" is a ${stat.isSymbolicLink() ? 'symlink' : 'special file'}, not a regular file`);
      if (stat.nlink > 1) refuse('artifact-not-regular', `"${rel}" is a hard link`);
      const real = fs.realpathSync(abs);
      if (!real.startsWith(`${realOut}${path.sep}`)) refuse('artifact-escapes-output', `"${rel}" resolves outside the output directory`);
      const row = approved.get(rel);
      if (!row) refuse('artifact-unapproved-path', `"${rel}" was not in the approved outputs`);
      if (stat.size > row.max_bytes) refuse('artifact-too-large', `"${rel}" is ${stat.size} bytes; approved at most ${row.max_bytes}`);
      found.set(rel, fs.readFileSync(abs));
    }
  };
  walk(outDir, '');
  for (const row of slot.approved_outputs) {
    if (!found.has(row.path)) refuse('artifact-missing', `approved output "${row.path}" was not produced`);
    if (row.content_digest && sha256(found.get(row.path)) !== row.content_digest) {
      refuse('artifact-digest-mismatch', `"${row.path}" does not match the approved content digest`);
    }
  }
  return slot.approved_outputs.map((row) => ({ path: row.path, bytes: found.get(row.path) }));
}

// Execute the approved script. `sandbox` is injectable only so tests can show
// refusal; production passes nothing and gets the verified detector.
function runProjectionScript({
  target, slot, corpusDir, sandbox = detectSandboxSync(),
}) {
  if (sha256(slot.source) !== slot.script_digest) refuse('script-digest-mismatch', 'the script bytes no longer match the approved digest');
  if (!sandbox.available) {
    refuse('sandbox-unavailable', `${sandbox.code}: ${sandbox.reason}. Nothing was executed.`);
  }
  const work = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-projection-'));
  try {
    const outDir = path.join(work, 'out');
    const script = path.join(work, 'projection.js');
    fs.mkdirSync(outDir, { mode: 0o700 });
    fs.writeFileSync(script, slot.source, { mode: 0o600 });
    const repoDir = fs.realpathSync(target);
    const run = runSandboxed(sandbox.kind, {
      script,
      outDir,
      readDirs: [repoDir, corpusDir || path.join(repoDir, '.rig')],
      timeoutMs: slot.limits.timeout_ms,
      env: {
        RIG_REPO_DIR: repoDir,
        RIG_CORPUS_DIR: corpusDir || path.join(repoDir, '.rig'),
        RIG_OUT_DIR: outDir,
      },
    });
    if (run.timedOut) refuse('script-timeout', `the script did not finish within ${slot.limits.timeout_ms} ms`);
    if (run.status !== 0) refuse('script-failed', `the script exited with status ${run.status}: ${run.stderr.trim().split('\n').slice(-3).join(' | ')}`);
    return { script_digest: slot.script_digest, artifacts: collectArtifacts(outDir, slot) };
  } finally {
    fs.rmSync(work, { recursive: true, force: true });
  }
}

module.exports = {
  ScriptRefusal, validateScriptSlot, collectArtifacts, runProjectionScript, sha256, RESERVED,
};
