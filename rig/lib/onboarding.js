// Shared onboarding domain handler (Path B F-4/F-5).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { inventoryHarness } = require('./inspect');
const { buildOverlaps } = require('./adapt-overlap');
const { readMigrations, sha256, skillsDigest, validateSkillCatalog } = require('./skill-catalog');
const { containedPath } = require('./path-safety');
const { verifySshsig } = require('./policy');
const { journalWriter, parseGraftSections, upsertGraftSection } = require('./payload');
const { checkOnboarding } = require('./onboarding-check');
const {
  atomicWrite, canonicalProposal, readState, renderAdoptedConfig, renderGrafts, renderOverlaps,
  validateSummary, writeState,
} = require('./onboarding-state');

const ACTIONS = new Set(['prepare', 'propose', 'apply', 'check']);
const CATALOG_REL = '.rig/catalog.json';
const PLAYBOOK_REL = '.rig/skills/onboarding/SKILL.md';
const ALLOWED_SIGNERS_REL = '.rig/allowed-signers';
const APPROVAL_NAMESPACE = 'rig-plan-approval';

// The signed message binds the namespace and the exact proposal digest, so a
// signature made for policy activation (or for a different proposal) cannot be
// replayed as a plan approval.
function approvalMessage(planDigest) {
  return `rig-plan-approval\ndigest=${planDigest}\n`;
}

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
        : state.phase === 'approved' || state.phase === 'applying' ? 'apply'
          : state.phase === 'applied' ? 'check'
            : state.phase === 'checked' ? 'complete'
              : state.phase === 'failed' ? 'repair-and-resume'
                : 'inspect-repository';
  return {
    schema_version: 1,
    action,
    phase: state.phase,
    revision: state.revision,
    proposal_digest: state.proposal?.digest || null,
    artifacts: artifacts(target),
    critical_decisions: decisions,
    hard_failures: extra.hard_failures || [],
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

function currentDigest(target, rel) {
  const file = containedPath(target, rel);
  return fs.existsSync(file) ? sha256(fs.readFileSync(file)) : null;
}

// A receipt is only evidence of user presence if something outside the caller
// can be re-checked. `verified: true` was a caller-controlled Boolean: anyone
// who could hand `apply` a JSON object could assert it. The trust envelope now
// carries a signature that this process re-verifies against a repository-owned
// allowed-signers file, so approval means "a listed human key signed exactly
// this proposal digest under the plan-approval namespace" and nothing weaker.
function approvalRecord(receipt, proposalDigest, target) {
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)
    || receipt.schema_version !== 1 || receipt.kind !== 'plan-approval'
    || receipt.plan_digest !== proposalDigest || !receipt.approval
    || typeof receipt.approval !== 'object' || Array.isArray(receipt.approval)
    || !['host-native', 'external-sshsig'].includes(receipt.approval.method)) {
    fail('approval receipt is invalid or is not bound to the current proposal digest');
  }
  if (receipt.approval.method === 'host-native') {
    // Mirrors the policy-activation stance: no host ships an attestation this
    // process can re-verify, so the path hard-refuses instead of trusting an
    // opaque blob. It stays in the accepted method list so the refusal names
    // the real gap rather than reading as a schema typo.
    fail('host-native approval has no configured verifier for plan approval; use external-sshsig');
  }
  const allowedSigners = containedPath(target, ALLOWED_SIGNERS_REL);
  if (!fs.existsSync(allowedSigners)) {
    fail(`approval verifier not configured: ${ALLOWED_SIGNERS_REL} is missing`);
  }
  const verified = verifySshsig({
    allowedSigners,
    identity: receipt.approval.identity,
    namespace: APPROVAL_NAMESPACE,
    message: approvalMessage(proposalDigest),
    signature: receipt.approval.signature,
  });
  return {
    proposal_digest: proposalDigest,
    method: 'external-sshsig',
    identity: verified.identity,
    fingerprint: verified.fingerprint,
    receipt_digest: sha256(JSON.stringify(receipt)),
  };
}

function installedSkillScopes(target) {
  const scopes = [];
  if (fs.existsSync(containedPath(target, '.agents/skills/rig-onboarding/SKILL.md'))) {
    scopes.push({ host_scope: 'codex', root: '.agents/skills' });
  }
  if (fs.existsSync(containedPath(target, '.claude/skills/rig-onboarding/SKILL.md'))) {
    scopes.push({ host_scope: 'claude', root: '.claude/skills' });
  }
  if (!scopes.length && fs.existsSync(containedPath(target, PLAYBOOK_REL))) {
    scopes.push({ host_scope: 'instruction-only', root: '.rig/skills' });
  }
  if (!scopes.length) fail('no installed skill discovery scope is available for an approved projection');
  return scopes;
}

function projectedSkillName(skill) {
  return skill.name === 'rig' || skill.name.startsWith('rig-') ? skill.name : `rig-${skill.name}`;
}

function rewriteProjectedName(bytes, name) {
  const source = bytes.toString('utf8');
  const next = source.replace(
    /^(---\n(?:(?!---\n)[^\n]*\n)*?name:\s*)[^\n]+/m,
    (_match, start) => `${start}${name}`,
  );
  if (next === source) fail('selected skill has no rewriteable frontmatter name');
  return Buffer.from(next);
}

function sourceFiles(root, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(absolute, rel));
    else if (!entry.name.endsWith('.tmpl') && entry.name !== 'TODOS-format.md') files.push({ rel, bytes: fs.readFileSync(absolute) });
  }
  return files;
}

function optionalProjectionSource(target, skill) {
  if (skill.source_kind !== 'optional' || !skill.source_rel.startsWith('rig/catalog/skills/')) {
    fail(`selected skill "${skill.id}" is not an installed optional runtime skill`);
  }
  const installed = `.rig/runtime/rig/${skill.source_rel.slice('rig/'.length)}`;
  const skillFile = containedPath(target, installed);
  if (!fs.existsSync(skillFile)) fail(`selected skill "${skill.id}" is missing from the installed runtime shelf`);
  return sourceFiles(path.dirname(skillFile));
}

function selectedCatalogSkills(catalog, selected) {
  if (new Set(selected).size !== selected.length) fail('proposal selects the same skill more than once');
  return selected.map((id) => {
    const matches = catalog.skills.filter((skill) => skill.id === id || skill.name === id);
    if (matches.length !== 1) fail(`proposal selects unknown skill "${id}"`);
    return matches[0];
  });
}

function cleanProjection(target, writer, rel) {
  const digest = currentDigest(target, rel);
  if (digest === null) return;
  const prior = writer.latest(rel);
  if (!prior || prior.digest !== digest) {
    fail(`selected skill projection conflicts with repository-owned path "${rel}"`);
  }
}

function planSkillProjections(target, catalog, selected, writer) {
  const scopes = installedSkillScopes(target);
  const plans = [];
  const rows = [];
  for (const skill of selectedCatalogSkills(catalog, selected)) {
    const name = projectedSkillName(skill);
    if (skill.source_kind === 'core') {
      for (const scope of scopes) {
        const rel = `${scope.root}/${name}/SKILL.md`;
        const digest = currentDigest(target, rel);
        if (!digest) fail(`required skill "${skill.id}" was not staged for ${scope.host_scope}`);
        rows.push({ skill: skill.id, host_scope: scope.host_scope, path: rel, sha256: digest });
      }
      continue;
    }
    const files = optionalProjectionSource(target, skill);
    const skillFile = files.find(({ rel }) => rel === 'SKILL.md');
    if (!skillFile) fail(`selected skill "${skill.id}" has no SKILL.md`);
    for (const scope of scopes) {
      const root = `${scope.root}/${name}`;
      for (const source of files) {
        const rel = `${root}/${source.rel}`;
        const bytes = source.rel === 'SKILL.md' ? rewriteProjectedName(source.bytes, name) : source.bytes;
        cleanProjection(target, writer, rel);
        plans.push({ rel, bytes, ownership: currentDigest(target, rel) === null ? 'create_owned' : 'replace_owned' });
        if (source.rel === 'SKILL.md') {
          rows.push({ skill: skill.id, host_scope: scope.host_scope, path: rel, sha256: sha256(bytes) });
        }
      }
    }
  }
  // The legacy `skills` ledger deduplicates by skill ID so external callers
  // that depend on one-entry-per-skill (e.g. the AT-PB-10 acceptance case)
  // are not broken.  The `projections` list preserves every (skill, host,
  // path) triple so that check can verify each host copy independently — a
  // two-host install therefore produces two projection entries for the same
  // skill even though `skills` still holds one.
  const uniqueRows = [...new Map(rows.map((row) => [row.skill, row])).values()];
  const sorted = (list) => [...list].sort((a, b) => a.skill.localeCompare(b.skill) || a.host_scope.localeCompare(b.host_scope) || a.path.localeCompare(b.path));
  return { plans, rows: sorted(uniqueRows), projections: sorted(rows) };
}

function preflightGrafts(target, grafts) {
  const seen = new Set();
  for (const graft of grafts) {
    const key = `${graft.path}\0${graft.capability}`;
    if (seen.has(key)) fail(`proposal duplicates graft "${graft.capability}" at "${graft.path}"`);
    seen.add(key);
    // A dry writer exercises all path, link, UTF-8, marker, content, and CAS
    // checks before the first mutation without allowing the helper to write.
    upsertGraftSection(target, {
      ...graft,
      expected_file_digest: graft.preimage_digest,
    }, () => {});
  }
}

function preflightOwnedFiles(target, ownedFiles, writer) {
  for (const owned of ownedFiles) {
    if (!owned.path.startsWith('.rig/')) fail(`owned file path "${owned.path}" is outside Rig ownership`);
    const digest = currentDigest(target, owned.path);
    if (digest !== owned.preimage_digest) fail(`owned file "${owned.path}" has a stale preimage digest`);
    if (digest !== null && (!writer.latest(owned.path) || writer.latest(owned.path).digest !== digest)) {
      fail(`owned file "${owned.path}" is not journal-proven Rig ownership`);
    }
  }
}

function writeIfChanged(target, rel, contents) {
  const file = containedPath(target, rel);
  const next = Buffer.isBuffer(contents) ? contents : Buffer.from(contents);
  if (!fs.existsSync(file) || !fs.readFileSync(file).equals(next)) atomicWrite(target, rel, next);
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

function requireCurrentRevision(request, state, action) {
  if (!state || !state.proposal) fail(`onboarding ${action} requires a current proposal`);
  if (state.revision !== request.expected_revision) {
    fail(`stale revision: expected ${state.revision}, received ${request.expected_revision}`);
  }
}

function apply(request) {
  return withOnboardingLock(request.target, () => {
    const state = readState(request.target);
    requireCurrentRevision(request, state, 'apply');
    // Validate the user-presence receipt first, even when semantic decisions
    // remain unresolved, so a self-made or unbound approval can never be
    // mistaken for a valid attempt.
    const approval = approvalRecord(request.approval, state.proposal.digest, request.target);
    if (state.proposal.critical_decisions.some((decision) => decision.status !== 'resolved')) {
      fail('apply is blocked by an unresolved critical decision');
    }
    if (state.phase === 'applied' || state.phase === 'checked') {
      if (state.applied?.proposal_digest !== state.proposal.digest) {
        fail(`apply action is invalid from phase "${state.phase}"`);
      }
      return response('apply', request.target, state);
    }
    if (state.phase !== 'proposed') fail(`apply action is invalid from phase "${state.phase}"`);

    const { catalog, digest } = loadInstalledCatalog(request.target);
    if (digest !== state.release.catalog_digest || digest !== state.proposal.catalog_digest) {
      fail('the skill catalog changed since this proposal: approval is stale');
    }

    const writer = journalWriter(request.target);
    const projection = planSkillProjections(request.target, catalog, state.proposal.selected_skills, writer);
    preflightGrafts(request.target, state.proposal.grafts);
    preflightOwnedFiles(request.target, state.proposal.owned_files, writer);

    const graftDigests = new Map();
    const appliedGrafts = [];
    const appliedOwnedFiles = [];
    try {
      for (const projectionFile of projection.plans) {
        writer(request.target, projectionFile.rel, projectionFile.bytes, 0o644, projectionFile.ownership);
      }
      for (const graft of state.proposal.grafts) {
        const expected = graftDigests.has(graft.path) ? graftDigests.get(graft.path) : graft.preimage_digest;
        const result = upsertGraftSection(request.target, {
          ...graft,
          expected_file_digest: expected,
        }, writer);
        graftDigests.set(graft.path, result.file_digest);
        appliedGrafts.push({ ...graft, content_digest: sha256(graft.content.trim()), status: 'applied', file_digest: result.file_digest });
      }
      for (const owned of state.proposal.owned_files) {
        writer(request.target, owned.path, owned.content, 0o644, owned.preimage_digest === null ? 'create_owned' : 'replace_owned');
        appliedOwnedFiles.push({ path: owned.path, sha256: sha256(owned.content) });
      }
      writer.finish();
    } catch (error) {
      // Keep a pending journal transaction if any mutation landed. It is the
      // resume evidence; state is intentionally not advanced on this path.
      throw error;
    }

    // Snapshot the repository inventory immediately after all writes are
    // committed.  The snapshot is taken post-apply so that Rig-managed graft
    // sections are already baked into each file's digest; re-checking against
    // this snapshot therefore treats the graft as baseline and only flags
    // external edits made after approval.
    const postApplyInventory = inventoryHarness(request.target);
    const inventorySnapshot = {};
    for (const entry of postApplyInventory.entries) {
      inventorySnapshot[entry.path] = {
        kind: entry.kind,
        host: entry.host,
        bytes: entry.bytes,
        digest: entry.sha256,
      };
    }

    const next = {
      ...state,
      revision: state.revision + 1,
      phase: 'applied',
      approval,
      applied: {
        proposal_digest: state.proposal.digest,
        skills: projection.rows,
        projections: projection.projections,
        grafts: appliedGrafts.sort((a, b) => a.path.localeCompare(b.path) || a.capability.localeCompare(b.capability)),
        owned_files: appliedOwnedFiles.sort((a, b) => a.path.localeCompare(b.path)),
        inventory_snapshot: inventorySnapshot,
      },
      checks: null,
      last_error: null,
    };
    writeIfChanged(request.target, '.rig/grafts.md', renderGrafts(next));
    writeState(request.target, next);
    return response('apply', request.target, next);
  });
}

function failure(code, pathValue, detail) {
  return { code, path: pathValue, detail };
}

function reconcileApplied(target, state) {
  const hardFailures = [];
  let catalog;
  let digest;
  try {
    ({ catalog, digest } = loadInstalledCatalog(target));
  } catch (error) {
    hardFailures.push(failure('state-incomplete', '.rig/catalog.json', error.message));
    return hardFailures;
  }
  if (digest !== state.release.catalog_digest || !state.proposal || state.applied.proposal_digest !== state.proposal.digest) {
    hardFailures.push(failure('state-incomplete', '.rig/state.json', 'state, proposal, and installed catalog are not bound to one applied digest'));
  }
  const summary = containedPath(target, '.rig/onboarding-summary.md');
  if (!state.proposal || !fs.existsSync(summary) || sha256(fs.readFileSync(summary)) !== state.proposal.summary_digest) {
    hardFailures.push(failure('state-incomplete', '.rig/onboarding-summary.md', 'the approved summary is missing or differs from the applied proposal'));
  }
  // Prefer the full per-host projections list; fall back to the legacy
  // deduplicated skills list for state written before Task 9.
  const projectionRows = state.applied.projections || state.applied.skills || [];
  for (const row of projectionRows) {
    const digestAtPath = currentDigest(target, row.path);
    if (digestAtPath !== row.sha256) {
      hardFailures.push(failure('state-incomplete', row.path, `selected skill "${row.skill}" is missing or has changed`));
    }
  }
  for (const row of state.applied.owned_files || []) {
    if (currentDigest(target, row.path) !== row.sha256) {
      hardFailures.push(failure('state-incomplete', row.path, 'Rig-owned applied file is missing or has changed'));
    }
  }
  for (const row of state.applied.grafts || []) {
    const file = containedPath(target, row.path);
    if (!fs.existsSync(file)) {
      hardFailures.push(failure('state-incomplete', row.path, `approved graft "${row.capability}" is missing`));
      continue;
    }
    try {
      const section = parseGraftSections(fs.readFileSync(file)).sections
        .find((candidate) => candidate.capability === row.capability && candidate.version === row.version);
      if (!section || section.content_digest !== row.content_digest) {
        hardFailures.push(failure('state-incomplete', row.path, `approved graft "${row.capability}" is missing or has changed`));
      }
    } catch (error) {
      hardFailures.push(failure('malformed-graft', row.path, error.message));
    }
  }
  // Keep this read explicit: reconciliation validates the live catalogue,
  // while selection remains entirely in the already approved proposal.
  void catalog;
  return hardFailures;
}

function check(request) {
  return withOnboardingLock(request.target, () => {
    const state = readState(request.target);
    requireCurrentRevision(request, state, 'check');
    if (!['applied', 'checked', 'failed'].includes(state.phase)) {
      fail(`check action is invalid from phase "${state.phase}"`);
    }
    let catalog = null;
    try { ({ catalog } = loadInstalledCatalog(request.target)); } catch { /* reconciliation records the state failure */ }
    const supplemental = catalog
      ? checkOnboarding(request.target, state, catalog)
      : { hardFailures: [], warnings: [], weight: { files: 0, bytes: 0, previous_release_files: 0, previous_release_bytes: 0 } };
    const hardFailures = [...reconcileApplied(request.target, state), ...supplemental.hardFailures];
    const checks = {
      status: hardFailures.length ? 'fail' : 'pass',
      hard_failures: hardFailures,
      warnings: supplemental.warnings,
      weight: supplemental.weight,
    };
    const phase = hardFailures.length ? 'failed' : 'checked';
    const unchanged = state.phase === phase && JSON.stringify(state.checks) === JSON.stringify(checks);
    if (unchanged) return response('check', request.target, state, { hard_failures: hardFailures, warnings: checks.warnings });
    const next = {
      ...state,
      revision: state.revision + 1,
      phase,
      checks,
      last_error: hardFailures[0]?.detail || null,
    };
    writeIfChanged(request.target, '.rig/grafts.md', renderGrafts(next));
    writeState(request.target, next);
    return response('check', request.target, next, { hard_failures: hardFailures, warnings: checks.warnings });
  });
}

function handleOnboarding(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request)) fail('onboarding request must be an object');
  if (request.schema_version !== 1) fail(`unsupported onboarding schema version: ${request.schema_version}`);
  if (!ACTIONS.has(request.action)) fail(`unknown onboarding action: ${request.action}`);
  if (typeof request.target !== 'string' || !request.target) fail('onboarding request needs a target');
  if (request.action === 'prepare') return prepare(request.target);
  if (request.action === 'propose') return propose(request);
  if (request.action === 'apply') return apply(request);
  return check(request);
}

module.exports = {
  ALLOWED_SIGNERS_REL, APPROVAL_NAMESPACE, approvalMessage, handleOnboarding, loadInstalledCatalog,
};
