// Shared onboarding domain handler (Path B F-4/F-5).
//
// Slice 1 scope: the catalogue-facing halves of `prepare` and `propose` — the
// installed `.rig/catalog.json` is validated and pinned to the state before any
// proposal is accepted. The remaining actions (`apply`, `check`), the full
// inventory writer, and the Markdown renderers land with their own frozen
// tests; this module is the single place they attach to.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { collectHarnessFiles } = require('./inspect');
const { canonical, sha256, skillsDigest, validateSkillCatalog } = require('./skill-catalog');
const { containedPath } = require('./path-safety');

const ACTIONS = new Set(['prepare', 'propose', 'apply', 'check']);
const CATALOG_REL = '.rig/catalog.json';
const STATE_REL = '.rig/state.json';

function fail(message) {
  throw new Error(`rig: ${message}`);
}

function readJson(file, label) {
  let text;
  try {
    text = fs.readFileSync(file, 'utf8');
  } catch {
    fail(`${label} is missing or unreadable`);
  }
  try {
    return JSON.parse(text);
  } catch {
    fail(`${label} is not valid JSON`);
  }
  return null;
}

function writeJson(file, value) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, `${JSON.stringify(value, null, 2)}\n`);
  fs.renameSync(tmp, file);
}

// Load and fully validate the installed catalogue. A malformed row, an alias
// that no migration produced, or a `release.skills_digest` that does not match
// the rows it claims to cover is a hard failure — never a silent refresh.
function loadInstalledCatalog(target) {
  const file = containedPath(target, CATALOG_REL);
  const catalog = validateSkillCatalog(readJson(file, 'the installed skill catalog (.rig/catalog.json)'));
  const recomputed = skillsDigest(catalog);
  if (!catalog.release || catalog.release.skills_digest !== recomputed) {
    fail('the installed skill catalog digest is stale: .rig/catalog.json no longer matches its own rows');
  }
  return { catalog, digest: sha256(fs.readFileSync(file)) };
}

// Bounded structural inventory digest. The full S-1 entry schema lands with
// `inventoryHarness`; this records only what the state machine needs today.
function inventorySummary(target) {
  const entries = collectHarnessFiles(target)
    .map((file) => ({
      path: path.relative(target, file).split(path.sep).join('/'),
      bytes: fs.statSync(file).size,
      sha256: sha256(fs.readFileSync(file)),
    }))
    .sort((a, b) => a.path.localeCompare(b.path));
  return { digest: sha256(canonical({ entries, warnings: [] })), entries: entries.length, warnings: 0 };
}

function releaseVersion(target, catalog) {
  const file = containedPath(target, '.rig/release.json');
  if (fs.existsSync(file)) {
    const release = readJson(file, 'the installed release marker (.rig/release.json)');
    if (release && typeof release.tag === 'string') return release.tag;
  }
  return catalog.release.version;
}

function readState(target) {
  const file = containedPath(target, STATE_REL);
  return fs.existsSync(file) ? readJson(file, 'the onboarding state (.rig/state.json)') : null;
}

function envelope(action, state, extra = {}) {
  return {
    schema_version: 1,
    action,
    phase: state.phase,
    revision: state.revision,
    proposal_digest: state.proposal ? state.proposal.digest : null,
    critical_decisions: [],
    hard_failures: [],
    warnings: [],
    next_action: 'inspect-repository',
    ...extra,
  };
}

function prepare(target) {
  const { catalog, digest } = loadInstalledCatalog(target);
  const inventory = inventorySummary(target);
  const previous = readState(target);
  const unchanged = previous
    && previous.inventory
    && previous.inventory.digest === inventory.digest
    && previous.release
    && previous.release.catalog_digest === digest;
  if (unchanged) return envelope('prepare', previous, { context: { catalog } });

  const state = {
    schema_version: 1,
    revision: previous ? previous.revision + 1 : 1,
    phase: 'prepared',
    release: { version: releaseVersion(target, catalog), catalog_digest: digest },
    inventory,
    proposal: null,
    approval: null,
    applied: previous ? previous.applied : { proposal_digest: null, skills: [], grafts: [], owned_files: [] },
    checks: null,
    last_error: null,
  };
  writeJson(containedPath(target, STATE_REL), state);
  return envelope('prepare', state, { context: { catalog } });
}

function propose(request) {
  const state = readState(request.target);
  if (!state) fail('no prepared onboarding state: run prepare before propose');
  if (state.revision !== request.expected_revision) {
    fail(`stale revision: expected ${state.revision}, received ${request.expected_revision}`);
  }
  const { digest } = loadInstalledCatalog(request.target);
  if (digest !== state.release.catalog_digest) {
    fail('the skill catalog changed since prepare: this proposal is stale and must be rebuilt');
  }
  fail('propose is not implemented yet in this slice');
  return null;
}

function handleOnboarding(request) {
  if (!request || typeof request !== 'object') fail('onboarding request must be an object');
  if (request.schema_version !== 1) fail(`unsupported onboarding schema version: ${request.schema_version}`);
  if (!ACTIONS.has(request.action)) fail(`unknown onboarding action: ${request.action}`);
  if (typeof request.target !== 'string' || !request.target) fail('onboarding request needs a target');
  if (request.action === 'prepare') return prepare(request.target);
  if (request.action === 'propose') return propose(request);
  return fail(`onboarding action "${request.action}" is not available from phase "${(readState(request.target) || {}).phase}"`);
}

module.exports = { handleOnboarding, loadInstalledCatalog };
