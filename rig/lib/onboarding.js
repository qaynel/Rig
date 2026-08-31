// Shared onboarding domain handler (Path B F-4/F-5).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { inventoryHarness } = require('./inspect');
const { buildOverlaps } = require('./adapt-overlap');
const { readMigrations, sha256, skillsDigest, validateSkillCatalog } = require('./skill-catalog');
const { containedPath } = require('./path-safety');
const {
  atomicWrite, canonicalProposal, readState, renderAdoptedConfig, renderOverlaps,
  validateSummary, writeState,
} = require('./onboarding-state');

const ACTIONS = new Set(['prepare', 'propose', 'apply', 'check']);
const CATALOG_REL = '.rig/catalog.json';
const PLAYBOOK_REL = '.rig/skills/onboarding/SKILL.md';

function fail(message) {
  throw new Error(`rig: ${message}`);
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    fail(`${label} is missing or unreadable`);
  }
}

// Load and fully validate the installed catalogue. A malformed row, an alias
// that no migration produced, or a stale digest is a hard failure — never a
// silent refresh.
function loadInstalledCatalog(target) {
  const file = containedPath(target, CATALOG_REL);
  const catalog = validateSkillCatalog(readJson(file, 'the installed skill catalog (.rig/catalog.json)'));
  const recomputed = skillsDigest(catalog);
  if (!catalog.release || catalog.release.skills_digest !== recomputed) {
    fail('the installed skill catalog digest is stale: .rig/catalog.json no longer matches its own rows');
  }
  return { catalog, digest: sha256(fs.readFileSync(file)) };
}

function releaseVersion(target, catalog) {
  const file = containedPath(target, '.rig/release.json');
  if (fs.existsSync(file)) {
    const release = readJson(file, 'the installed release marker (.rig/release.json)');
    if (typeof release?.tag === 'string') return release.tag;
  }
  return catalog.release.version;
}

function withOnboardingLock(target, operation) {
  const lock = containedPath(target, '.rig/onboarding.lock');
  fs.mkdirSync(path.dirname(lock), { recursive: true });
  let descriptor;
  try {
    descriptor = fs.openSync(lock, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') fail('onboarding lock exists; refuse to break it');
    throw error;
  }
  try {
    fs.writeFileSync(descriptor, `${process.pid} ${new Date().toISOString()}\n`);
    return operation();
  } finally {
    fs.closeSync(descriptor);
    fs.rmSync(lock, { force: true });
  }
}

function artifact(target, rel) {
  const file = containedPath(target, rel);
  return { path: rel, sha256: fs.existsSync(file) ? sha256(fs.readFileSync(file)) : null };
}

function artifacts(target) {
  return {
    catalog: artifact(target, CATALOG_REL),
    adopted_config: artifact(target, '.rig/adopted-config.md'),
    overlaps: artifact(target, '.rig/overlaps.md'),
    grafts: artifact(target, '.rig/grafts.md'),
    summary: artifact(target, '.rig/onboarding-summary.md'),
    state: artifact(target, '.rig/state.json'),
  };
}

function response(action, target, state, extra = {}) {
  const decisions = state.proposal?.critical_decisions || [];
  const nextAction = action === 'prepare' ? 'inspect-repository'
    : state.phase === 'needs-decision' ? 'resolve-critical-decisions'
      : state.phase === 'proposed' ? 'obtain-approval'
        : 'inspect-repository';
  return {
    schema_version: 1,
    action,
    phase: state.phase,
    revision: state.revision,
    proposal_digest: state.proposal?.digest || null,
    artifacts: artifacts(target),
    critical_decisions: decisions,
    hard_failures: [],
    warnings: extra.warnings || [],
    next_action: nextAction,
    ...(extra.context ? { context: extra.context } : {}),
  };
}

function prepareContext(target, catalog) {
  const playbook = containedPath(target, PLAYBOOK_REL);
  return {
    playbook: fs.existsSync(playbook) ? fs.readFileSync(playbook, 'utf8') : '',
    catalog,
    adopted_config: fs.readFileSync(containedPath(target, '.rig/adopted-config.md'), 'utf8'),
    overlaps: fs.readFileSync(containedPath(target, '.rig/overlaps.md'), 'utf8'),
  };
}

function prepare(target) {
  return withOnboardingLock(target, () => {
    const { catalog, digest } = loadInstalledCatalog(target);
    const inventory = inventoryHarness(target);
    const previous = readState(target);
    const inventoryState = {
      digest: inventory.digest,
      entries: inventory.entries.length,
      warnings: inventory.warnings.length,
    };
    const unchanged = previous
      && previous.inventory?.digest === inventory.digest
      && previous.release?.catalog_digest === digest;
    if (unchanged) {
      return response('prepare', target, previous, {
        warnings: inventory.warnings,
        context: prepareContext(target, catalog),
      });
    }

    const overlaps = buildOverlaps(inventory, catalog, readMigrations());
    atomicWrite(target, '.rig/adopted-config.md', renderAdoptedConfig(inventory));
    atomicWrite(target, '.rig/overlaps.md', renderOverlaps(overlaps));
    const state = {
      schema_version: 1,
      revision: previous ? previous.revision + 1 : 1,
      phase: 'prepared',
      release: { version: releaseVersion(target, catalog), catalog_digest: digest },
      inventory: inventoryState,
      proposal: null,
      approval: null,
      applied: previous?.applied || { proposal_digest: null, skills: [], grafts: [], owned_files: [] },
      checks: null,
      last_error: null,
    };
    writeState(target, state);
    return response('prepare', target, state, {
      warnings: inventory.warnings,
      context: prepareContext(target, catalog),
    });
  });
}

function propose(request) {
  return withOnboardingLock(request.target, () => {
    const state = readState(request.target);
    if (!state) fail('no prepared onboarding state: run prepare before propose');
    if (!['prepared', 'proposed', 'needs-decision'].includes(state.phase)) {
      fail(`propose action is invalid from phase "${state.phase}"`);
    }
    if (state.revision !== request.expected_revision) {
      fail(`stale revision: expected ${state.revision}, received ${request.expected_revision}`);
    }
    const { digest } = loadInstalledCatalog(request.target);
    if (digest !== state.release.catalog_digest) {
      fail('the skill catalog changed since prepare: this proposal is stale and must be rebuilt');
    }
    const summary = validateSummary(request.summary_markdown);
    const stored = canonicalProposal(request.proposal, state, sha256(Buffer.from(summary)));
    const summaryFile = containedPath(request.target, '.rig/onboarding-summary.md');
    const identical = state.proposal && state.proposal.digest === stored.digest
      && fs.existsSync(summaryFile) && fs.readFileSync(summaryFile, 'utf8') === summary;
    if (identical) return response('propose', request.target, state);

    const unresolved = stored.critical_decisions.some((decision) => decision.status !== 'resolved');
    const next = {
      ...state,
      revision: state.revision + 1,
      phase: unresolved ? 'needs-decision' : 'proposed',
      proposal: stored,
      approval: null,
      checks: null,
      last_error: null,
    };
    atomicWrite(request.target, '.rig/onboarding-summary.md', summary);
    writeState(request.target, next);
    return response('propose', request.target, next);
  });
}

function handleOnboarding(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('onboarding request must be an object');
  if (request.schema_version !== 1) fail(`unsupported onboarding schema version: ${request.schema_version}`);
  if (!ACTIONS.has(request.action)) fail(`unknown onboarding action: ${request.action}`);
  if (typeof request.target !== 'string' || !request.target) fail('onboarding request needs a target');
  if (request.action === 'prepare') return prepare(request.target);
  if (request.action === 'propose') return propose(request);
  const phase = (readState(request.target) || {}).phase;
  if (request.action === 'apply') fail(`onboarding apply requires a current proposal and approval; phase is "${phase}"`);
  fail(`onboarding action "${request.action}" is not available from phase "${phase}"`);
}

module.exports = { handleOnboarding, loadInstalledCatalog };
