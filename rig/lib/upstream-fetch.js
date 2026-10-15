// Third-party fetch during onboarding (North star 6).
//
// Metadata in the corpus (rig/corpus/upstream/<id>.json) pins an upstream
// revision, the digest of its archive, the licence notice that must travel with
// it, and the local patches Rig applies. This module downloads into a staging
// directory, verifies the digest before reading a single entry, extracts only
// regular files in memory, checks each file against its pinned base digest,
// applies the local patches, checks the pinned result digests, and returns the
// verified bytes. Any failure is a named gap; nothing partial is ever returned
// as success.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const zlib = require('node:zlib');
const { readTar } = require('./tar-read');
const { applyPatch } = require('./patch-apply');

const MAX_ARCHIVE_BYTES = 128 * 1024 * 1024;
const MAX_TAR_BYTES = 512 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 120000;
const ID_RE = /^[a-z0-9][a-z0-9-]{0,40}$/;

function sha256(bytes) {
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function gap(code, detail) {
  return { code, detail };
}

function setupGuidance(code) {
  return {
    'upstream-unavailable': 'check the network or point RIG_UPSTREAM_MIRROR_<ID> at a reachable mirror; the archive is verified by digest either way',
    'digest-mismatch': 'the downloaded bytes are not the pinned revision; do not use them. Re-run, or report a tampered mirror',
    'licence-missing': 'restore the licence notice named in the upstream metadata and re-run',
  }[code] || null;
}

function loadUpstream(id, metaDir) {
  if (typeof id !== 'string' || !ID_RE.test(id)) throw new Error(`rig: invalid upstream id "${id}"`);
  const file = path.join(metaDir, `${id}.json`);
  if (!fs.existsSync(file)) throw new Error(`rig: no upstream metadata for "${id}"`);
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function applyRename(text, pairs) {
  return pairs.reduce((out, [from, to]) => out.split(from).join(to), text);
}

// Default transport: https (and file:// for local mirrors and fixtures). Plain
// http and every other scheme are refused so a downgrade cannot be configured.
async function defaultFetcher(url) {
  const parsed = new URL(url);
  if (parsed.protocol === 'file:') {
    const stat = fs.statSync(parsed.pathname);
    if (stat.size > MAX_ARCHIVE_BYTES) throw new Error('archive exceeds the size limit');
    return fs.readFileSync(parsed.pathname);
  }
  if (parsed.protocol !== 'https:') throw new Error(`refusing ${parsed.protocol} transport; https or file only`);
  const response = await fetch(url, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS), redirect: 'follow' });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const length = Number(response.headers.get('content-length') || 0);
  if (length > MAX_ARCHIVE_BYTES) throw new Error('archive exceeds the size limit');
  const bytes = Buffer.from(await response.arrayBuffer());
  if (bytes.length > MAX_ARCHIVE_BYTES) throw new Error('archive exceeds the size limit');
  return bytes;
}

function mirrorFor(meta, env) {
  return env[`RIG_UPSTREAM_MIRROR_${meta.id.toUpperCase().replace(/-/g, '_')}`] || null;
}

// options: { metaDir, licencePath, fetcher?, env?, stagingRoot? }
// Returns { status: 'ok', files: Map(output -> Buffer), receipt } or
// { status: 'gap', gaps: [{code, detail, guidance}] }.
async function fetchUpstream(id, options) {
  const {
    metaDir, licencePath, fetcher = defaultFetcher, env = process.env, stagingRoot = os.tmpdir(),
  } = options;
  const meta = loadUpstream(id, metaDir);
  const fail = (code, detail) => ({ status: 'gap', id, gaps: [{ ...gap(code, detail), guidance: setupGuidance(code) }] });

  // The licence notice travels with every fetched byte; a missing or altered
  // notice stops the fetch before anything is downloaded.
  if (!fs.existsSync(licencePath) || sha256(fs.readFileSync(licencePath)) !== meta.licence.sha256) {
    return fail('licence-missing', `the ${meta.licence.spdx} notice (${meta.licence.notice}) is missing or altered`);
  }

  const staging = fs.mkdtempSync(path.join(stagingRoot, `rig-upstream-${id}-`));
  try {
    const url = mirrorFor(meta, env) || meta.archive.url;
    let archive;
    try {
      archive = Buffer.from(await fetcher(url));
    } catch (error) {
      return fail('upstream-unavailable', `${url}: ${error.message}`);
    }
    fs.writeFileSync(path.join(staging, 'archive.tar.gz'), archive, { mode: 0o600 });

    let tar;
    try {
      tar = zlib.gunzipSync(archive, { maxOutputLength: MAX_TAR_BYTES });
    } catch {
      return fail('digest-mismatch', 'the download is not a gzip archive, so it cannot be the pinned revision');
    }
    if (sha256(tar) !== meta.archive.tar_sha256) {
      return fail('digest-mismatch', `archive tar digest ${sha256(tar).slice(0, 16)}... is not the pinned ${meta.archive.tar_sha256.slice(0, 16)}... for revision ${meta.revision}`);
    }

    let entries;
    try {
      entries = readTar(tar, { ignoredLinks: meta.archive.ignored_links || {} });
    } catch (error) {
      return fail('archive-invalid', error.message);
    }

    const work = new Map();
    for (const row of meta.files) {
      if (row.upstream === null) continue;
      if (!entries.has(row.upstream)) return fail('upstream-file-missing', `${row.upstream} is not in revision ${meta.revision}`);
      const raw = entries.get(row.upstream);
      const bytes = row.rename ? Buffer.from(applyRename(raw.toString('utf8'), meta.rename)) : raw;
      if (sha256(bytes) !== row.base_sha256) return fail('patch-base-mismatch', `${row.upstream} does not match its pinned base digest`);
      work.set(row.output, bytes);
    }

    let patched = work;
    for (const patch of meta.local_patches) {
      const file = path.join(metaDir, patch.file);
      if (!fs.existsSync(file)) return fail('patch-missing', `${patch.id}: ${patch.file} is not present`);
      const text = fs.readFileSync(file);
      if (sha256(text) !== patch.sha256) return fail('patch-tampered', `${patch.id}: ${patch.file} does not match its pinned digest`);
      try {
        // Patch paths are repository paths under the shelf; map them onto outputs.
        patched = applyOnOutputs(patched, text.toString('utf8'));
      } catch (error) {
        return fail('patch-failed', `${patch.id}: ${error.message}`);
      }
    }

    for (const row of meta.files) {
      const bytes = patched.get(row.output);
      if (!bytes || sha256(bytes) !== row.final_sha256) return fail('patch-result-mismatch', `${row.output} does not match its pinned patched digest`);
    }
    const files = new Map(meta.files.map((row) => [row.output, patched.get(row.output)]));
    const receipt = {
      id,
      revision: meta.revision,
      tar_sha256: meta.archive.tar_sha256,
      licence: { spdx: meta.licence.spdx, sha256: meta.licence.sha256 },
      patches: meta.local_patches.map(({ id: patchId, sha256: digest }) => ({ id: patchId, sha256: digest })),
      files: [...files].map(([output, bytes]) => ({ path: output, sha256: sha256(bytes) })).sort((a, b) => a.path.localeCompare(b.path)),
    };
    return { status: 'ok', id, files, receipt };
  } finally {
    fs.rmSync(staging, { recursive: true, force: true });
  }
}

const SHELF_PREFIX = 'rig/catalog/skills/';

function applyOnOutputs(outputs, patchText) {
  const repoShaped = new Map([...outputs].map(([output, bytes]) => [`${SHELF_PREFIX}${output}`, bytes]));
  const result = applyPatch(repoShaped, patchText);
  return new Map([...result].map(([repoPath, bytes]) => [repoPath.slice(SHELF_PREFIX.length), bytes]));
}

// Synchronous form for the onboarding apply path. The fetch runs in a child
// process (spawn-guarded) and hands back the verified bytes; it can only use
// the default transport, so tests and offline users redirect it with the
// RIG_UPSTREAM_MIRROR_<ID> file:// or https mirror, which is digest-verified
// exactly like the original URL.
function fetchUpstreamSync(id, { metaDir, licencePath, env = process.env }) {
  const { spawnGuardedSync } = require('./spawn-guarded');
  const program = `
    const { fetchUpstream } = require(${JSON.stringify(__filename)});
    const [id, metaDir, licencePath] = JSON.parse(process.argv[1]);
    fetchUpstream(id, { metaDir, licencePath }).then((result) => {
      const files = result.files ? [...result.files].map(([k, v]) => [k, v.toString('base64')]) : undefined;
      process.stdout.write(JSON.stringify({ ...result, files }));
    }).catch((error) => { process.stdout.write(JSON.stringify({ status: 'gap', id: process.argv[1], gaps: [{ code: 'upstream-unavailable', detail: error.message, guidance: null }] })); });
  `;
  const run = spawnGuardedSync(process.execPath, ['-e', program, JSON.stringify([id, metaDir, licencePath])], {
    encoding: 'utf8', env, timeout: FETCH_TIMEOUT_MS + 30000, maxBuffer: 256 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'],
  });
  let parsed;
  try { parsed = JSON.parse(run.stdout); } catch {
    return { status: 'gap', id, gaps: [{ code: 'upstream-unavailable', detail: `the fetch process produced no result (${run.stderr.trim().slice(-200) || `status ${run.status}`})`, guidance: setupGuidance('upstream-unavailable') }] };
  }
  if (parsed.files) parsed.files = new Map(parsed.files.map(([k, v]) => [k, Buffer.from(v, 'base64')]));
  return parsed;
}

module.exports = { fetchUpstream, fetchUpstreamSync, loadUpstream, defaultFetcher, sha256 };
