// Shared onboarding domain handler (Path B F-4/F-5).
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { inventoryHarness } = require('./inspect');
const { buildOverlaps } = require('./adapt-overlap');
const {
  canonical: canonicalJson, readMigrations, sha256, skillsDigest, validateSkillCatalog,
} = require('./skill-catalog');
const { containedPath } = require('./path-safety');
const { verifySshsig } = require('./policy');
const {
  journalResumeDigest, journalWriter, parseGraftSections, removeGraftSection, upsertGraftSection,
} = require('./payload');
const { checkOnboarding } = require('./onboarding-check');
const { INSTRUCTION_ONLY_HOSTS } = require('./host-capabilities');
const {
  atomicWrite, canonicalProposal, proposalBodyDigest, readState, renderAdoptedConfig, renderGrafts, renderOverlaps,
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

// The installed release marker records the exact host IDs the installer
// selected (rig/lib/payload.js's runPayload). Onboarding trusts that list
// rather than inferring installed hosts from marker-file existence, so every
// installed host gets its own scope decision instead of one aggregate
// native-vs-instruction-only boolean.
function installedHostIds(target) {
  const file = containedPath(target, '.rig/release.json');
  if (!fs.existsSync(file)) fail('the installed release marker (.rig/release.json) is missing; re-run the installer');
  const release = readJson(file, 'the installed release marker (.rig/release.json)');
  const hosts = release?.hosts;
  if (!Array.isArray(hosts) || !hosts.length || !hosts.every((id) => typeof id === 'string')) {
    fail('the installed release marker (.rig/release.json) has no valid "hosts" list; re-run the installer');
  }
  return hosts;
}

// Native skill-discovery scopes Rig writes to directly. Only Codex and Claude
// have a Rig-managed native skill directory today (the installed wrapper
// markers this function checks for).
function nativeScope(target, host) {
  if (host === 'codex' && fs.existsSync(containedPath(target, '.agents/skills/rig-onboarding/SKILL.md'))) {
    return { host_scope: 'codex', root: '.agents/skills' };
  }
  if (host === 'claude' && fs.existsSync(containedPath(target, '.claude/skills/rig-onboarding/SKILL.md'))) {
    return { host_scope: 'claude', root: '.claude/skills' };
  }
  return null;
}

// Every host in INSTRUCTION_ONLY_HOSTS shares one instruction-only scope
// keyed by the canonical playbook marker, not by which host triggered it.
function instructionOnlyScope(target, host) {
  if (!INSTRUCTION_ONLY_HOSTS.has(host)) return null;
  if (!fs.existsSync(containedPath(target, PLAYBOOK_REL))) return null;
  return { host_scope: 'instruction-only', root: '.rig/skills' };
}

// Per-host, per-item decision — never an aggregate "any native host present"
// boolean. A native host's presence must not suppress another installed
// host's own instruction-only scope (AT-HD-10 I-B-2).
function installedSkillScopes(target) {
  const scopes = new Map();
  for (const host of installedHostIds(target)) {
    const scope = nativeScope(target, host) || instructionOnlyScope(target, host);
    if (scope) scopes.set(`${scope.host_scope}\0${scope.root}`, scope);
  }
  if (!scopes.size) fail('no installed skill discovery scope is available for an approved projection');
  return [...scopes.values()];
}

// The canonical, scope-independent identity of a skill: 'rig' stays 'rig'
// (it names itself, not a namespace); every other skill's canonical name has
// any leading "rig-" stripped, so re-adding it per scope is idempotent.
function canonicalSkillName(skill) {
  if (skill.name === 'rig') return 'rig';
  return skill.name.startsWith('rig-') ? skill.name.slice('rig-'.length) : skill.name;
}

// Naming is scope-specific, not skill-specific (rig/tier-1/routing.md's
// router contract): native layouts project as `rig-<name>`; the
// instruction-only layout projects unprefixed, since `rig-<name>` there maps
// to `.rig/skills/<name>/SKILL.md`.
function scopedSkillName(canonicalName, scope) {
  if (canonicalName === 'rig') return 'rig';
  return scope.host_scope === 'instruction-only' ? canonicalName : `rig-${canonicalName}`;
}

function rewriteProjectedName(bytes, name) {
  const source = bytes.toString('utf8');
  const pattern = /^(---\n(?:(?!---\n)[^\n]*\n)*?name:\s*)[^\n]+/m;
  // A scope whose target name equals the source's own unprefixed name (the
  // instruction-only scope, when the skill's canonical name has no "rig-"
  // prefix to strip) rewrites to byte-identical output — that is a correct,
  // idempotent rewrite, not evidence the pattern failed to match. Check the
  // match itself, not whether the replacement changed anything.
  if (!pattern.test(source)) fail('selected skill has no rewriteable frontmatter name');
  return Buffer.from(source.replace(pattern, (_match, start) => `${start}${name}`));
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
  // Bytes an interrupted run already put here carry no `applied` record yet, so
  // the ownership proof has to come from that run's pending record instead.
  if (prior?.digest === digest || journalResumeDigest(writer, rel) === digest) return;
  fail(`selected skill projection conflicts with repository-owned path "${rel}"`);
}

// One digest over every file a skill projects, keyed by the path inside the
// projected skill directory and deduplicated across host scopes (each scope
// receives identical bytes). `propose` freezes this value into the approved
// proposal; `apply` and `check` re-derive it, so the approval covers the bytes
// rather than only the skill's name.
function projectedDigest(entries) {
  const unique = [...new Map(entries.map((entry) => [`${entry.path}\0${entry.sha256}`, entry])).values()];
  unique.sort((a, b) => a.path.localeCompare(b.path) || a.sha256.localeCompare(b.sha256));
  return sha256(canonicalJson(unique));
}

// `writer` is optional: propose needs the bytes and their digests, while only
// apply owns the journal and therefore the repository-ownership conflict check.
function planSkillProjections(target, catalog, selected, writer) {
  const skills = selectedCatalogSkills(catalog, selected);
  const scopes = skills.length ? installedSkillScopes(target) : [];
  const plans = [];
  const rows = [];
  const projectedFiles = new Map();
  const record = (skill, rel, digest) => {
    const entries = projectedFiles.get(skill.id) || [];
    entries.push({ path: rel, sha256: digest });
    projectedFiles.set(skill.id, entries);
  };
  for (const skill of skills) {
    const canonicalName = canonicalSkillName(skill);
    if (skill.source_kind === 'core') {
      for (const scope of scopes) {
        const name = scopedSkillName(canonicalName, scope);
        const rel = `${scope.root}/${name}/SKILL.md`;
        const digest = currentDigest(target, rel);
        if (!digest) fail(`required skill "${skill.id}" was not staged for ${scope.host_scope}`);
        rows.push({ skill: skill.id, host_scope: scope.host_scope, path: rel, sha256: digest });
        record(skill, 'SKILL.md', digest);
      }
      continue;
    }
    const files = optionalProjectionSource(target, skill);
    const skillFile = files.find(({ rel }) => rel === 'SKILL.md');
    if (!skillFile) fail(`selected skill "${skill.id}" has no SKILL.md`);
    for (const scope of scopes) {
      const name = scopedSkillName(canonicalName, scope);
      const root = `${scope.root}/${name}`;
      for (const source of files) {
        const rel = `${root}/${source.rel}`;
        const bytes = source.rel === 'SKILL.md' ? rewriteProjectedName(source.bytes, name) : source.bytes;
        if (writer) cleanProjection(target, writer, rel);
        plans.push({ skill: skill.id, rel, bytes, ownership: currentDigest(target, rel) === null ? 'create_owned' : 'replace_owned' });
        record(skill, source.rel, sha256(bytes));
        if (source.rel === 'SKILL.md') {
          rows.push({ skill: skill.id, host_scope: scope.host_scope, path: rel, sha256: sha256(bytes) });
        }
      }
    }
  }
  const digests = new Map([...projectedFiles].map(([id, entries]) => [id, projectedDigest(entries)]));
  // The legacy `skills` ledger deduplicates by skill ID so external callers
  // that depend on one-entry-per-skill (e.g. the AT-PB-10 acceptance case)
  // are not broken.  The `projections` list preserves every (skill, host,
  // path) triple so that check can verify each host copy independently — a
  // two-host install therefore produces two projection entries for the same
  // skill even though `skills` still holds one.
  const uniqueRows = [...new Map(rows.map((row) => [row.skill, row])).values()];
  const sorted = (list) => [...list].sort((a, b) => a.skill.localeCompare(b.skill) || a.host_scope.localeCompare(b.host_scope) || a.path.localeCompare(b.path));
  return {
    plans, rows: sorted(uniqueRows), projections: sorted(rows), digests,
  };
}

// The per-skill binding a proposal freezes: the catalogue tree the selection
// was made from, and the exact bytes that selection will project.
function skillBindings(target, catalog, selected) {
  const { digests } = planSkillProjections(target, catalog, selected, null);
  return selectedCatalogSkills(catalog, selected)
    .map((skill) => ({
      id: skill.id,
      tree_digest: skill.tree_digest,
      projected_digest: digests.get(skill.id) || null,
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

// Approval was granted for these bytes. Anything that moved between propose and
// apply — a hand-edited staged source, a swapped catalogue row, a projection
// that reaches a skill nobody approved — makes the approval stale, not stale
// data to refresh silently.
function verifySkillBindings(proposal, catalog, projection) {
  const bindings = proposal.skill_bindings;
  if (!Array.isArray(bindings)) fail('approved skill bindings are invalid');
  const selected = new Set(proposal.selected_skills);
  const bound = new Set();
  for (const binding of bindings) {
    if (!binding || typeof binding !== 'object' || typeof binding.id !== 'string'
      || typeof binding.tree_digest !== 'string' || typeof binding.projected_digest !== 'string') {
      fail('approved skill binding is invalid');
    }
    if (bound.has(binding.id)) fail(`approved skill bindings contain duplicate skill "${binding.id}"`);
    if (!selected.has(binding.id)) fail(`approved skill binding names unselected skill "${binding.id}"`);
    bound.add(binding.id);
  }
  if (bindings.length !== selected.size) fail('approved skill bindings do not match selected skills');
  for (const id of projection.digests.keys()) {
    if (!bound.has(id)) fail(`stale proposal: projection produced skill "${id}" outside the approved selection`);
  }
  for (const binding of bindings) {
    if (projection.digests.get(binding.id) !== binding.projected_digest) {
      fail(`stale proposal: projected bytes for skill "${binding.id}" no longer match the approved projected_digest`);
    }
    const row = catalog.skills.find((skill) => skill.id === binding.id);
    if (!row || row.tree_digest !== binding.tree_digest) {
      fail(`stale proposal: catalogue tree_digest for skill "${binding.id}" has changed`);
    }
  }
}

function preflightGrafts(target, grafts, writer) {
  const seen = new Set();
  // A dry writer exercises all path, link, UTF-8, marker, content, and CAS
  // checks before the first mutation without allowing the helper to write. It
  // still reads the real journal, so an interrupted run's landed-but-unrecorded
  // bytes are recognised here as resumable rather than as a stale preimage.
  const dry = () => {};
  dry.latest = (rel) => writer?.latest?.(rel) ?? null;
  dry.interrupted = () => Boolean(writer?.interrupted?.());
  for (const graft of grafts) {
    const key = `${graft.path}\0${graft.capability}`;
    if (seen.has(key)) fail(`proposal duplicates graft "${graft.capability}" at "${graft.path}"`);
    seen.add(key);
    upsertGraftSection(target, {
      ...graft,
      expected_file_digest: graft.preimage_digest,
    }, dry);
  }
}

function preflightOwnedFiles(target, ownedFiles, writer) {
  for (const owned of ownedFiles) {
    if (!owned.path.startsWith('.rig/')) fail(`owned file path "${owned.path}" is outside Rig ownership`);
    const digest = currentDigest(target, owned.path);
    // Bytes an interrupted run already wrote are Rig's own unfinished work, not
    // a preimage that moved: the journal names them, so resume instead of
    // refusing. `journalResumeDigest` only says so while a transaction is open.
    if (digest !== null && journalResumeDigest(writer, owned.path) === digest) continue;
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
    const { catalog, digest } = loadInstalledCatalog(request.target);
    if (digest !== state.release.catalog_digest) {
      fail('the skill catalog changed since prepare: this proposal is stale and must be rebuilt');
    }
    const summary = validateSummary(request.summary_markdown);
    // The caller proposes skill names; the engine — not the caller — computes
    // the digests those names resolve to, so a proposal cannot be approved for
    // one set of bytes and applied against another.
    const stored = canonicalProposal(
      request.proposal, state, sha256(Buffer.from(summary)),
      (selected) => skillBindings(request.target, catalog, selected),
    );
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

const HAND_EDITED = 'obsolete Rig-owned artifact was hand-edited; leaving in place';
const NOT_RIG_CREATED = 'obsolete Rig-owned artifact is not journal-proven Rig-created; leaving in place';

function liveFilesUnder(target, dirRel) {
  const dir = containedPath(target, dirRel);
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  const found = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = `${dirRel}/${entry.name}`;
    if (entry.isDirectory()) found.push(...liveFilesUnder(target, rel));
    else if (entry.isFile()) found.push(rel);
  }
  return found;
}

// Core catalogue skills are staged by the installer: planSkillProjections
// records them without ever writing them, so apply must not delete them when
// they leave the selection either. Only what apply projected, apply removes.
function isApplyOwnedSkill(catalog, skillId) {
  const skill = catalog.skills.find((row) => row.id === skillId || row.name === skillId);
  return !skill || skill.source_kind !== 'core';
}

// Remove the directories a projection leaves behind, stopping at the projected
// skill root so a scope root (".agents/skills") is never pruned away.
function pruneEmptyDirs(target, rel, stopRel) {
  let dir = path.posix.dirname(rel);
  while (dir === stopRel || dir.startsWith(`${stopRel}/`)) {
    const abs = containedPath(target, dir);
    if (!fs.existsSync(abs) || fs.readdirSync(abs).length) return;
    fs.rmdirSync(abs);
    dir = path.posix.dirname(dir);
  }
}

// Reapplication is a three-set problem: what a previous apply put on disk, what
// the new proposal wants, and what is live right now. Anything in the first set
// and not the second is obsolete. It is only deleted when disk still holds
// exactly the bytes Rig wrote; an obsolete artifact a human has since edited is
// left in place and reported, because silently deleting their work is worse
// than leaving a stale file behind.
function planRemovals(target, state, projection, writer, catalog) {
  const previousProjections = state.applied?.projections || state.applied?.skills || [];
  const desiredPaths = new Set([
    ...projection.projections.map((row) => row.path),
    ...projection.plans.map((plan) => plan.rel),
  ]);
  const removals = { projections: [], grafts: [], unreconciled: [] };
  const seen = new Set();
  for (const row of previousProjections) {
    if (seen.has(row.path)) continue;
    seen.add(row.path);
    if (!isApplyOwnedSkill(catalog, row.skill)) continue;
    // The ledger records one SKILL.md per host, but a projection may have
    // written a whole tree, so sweep the live skill directory as well as the
    // recorded path — otherwise siblings survive their own skill. The desired-
    // path check is intentionally deferred to the inner loop so the sweep runs
    // even when SKILL.md is still desired (skill stays selected but loses a
    // sibling across catalog versions).
    const root = path.posix.dirname(row.path);
    for (const rel of new Set([row.path, ...liveFilesUnder(target, root)])) {
      if (desiredPaths.has(rel)) continue;
      const live = currentDigest(target, rel);
      const expected = rel === row.path ? row.sha256 : (writer.latest(rel)?.digest ?? null);
      if (live !== null && live !== expected) {
        removals.unreconciled.push({ path: rel, detail: HAND_EDITED });
        continue;
      }
      removals.projections.push({ path: rel, digest: live, root });
    }
  }
  const desiredGrafts = new Set(state.proposal.grafts.map((graft) => `${graft.path}\0${graft.capability}`));
  for (const row of state.applied?.grafts || []) {
    if (!desiredGrafts.has(`${row.path}\0${row.capability}`)) removals.grafts.push(row);
  }
  return removals;
}

function applyRemovals(target, removals, writer, graftDigests) {
  for (const row of removals.projections) {
    const result = typeof writer.remove === 'function'
      ? writer.remove(target, row.path, row.digest)
      : { removed: false };
    if (result.removed) pruneEmptyDirs(target, row.path, row.root);
    else removals.unreconciled.push({ path: row.path, detail: NOT_RIG_CREATED });
  }
  for (const graft of removals.grafts) {
    const file = containedPath(target, graft.path);
    const expected = graftDigests.has(graft.path)
      ? graftDigests.get(graft.path)
      : (fs.existsSync(file) ? sha256(fs.readFileSync(file)) : null);
    const result = removeGraftSection(target, {
      path: graft.path, capability: graft.capability, expected_file_digest: expected,
    }, writer);
    graftDigests.set(graft.path, result.file_digest);
  }
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
    // A stored digest is a witness, not the truth: re-derive it from the
    // proposal body before anything — including approval verification —
    // trusts state.proposal.digest. Storage can be tampered independently of
    // the field it is meant to witness.
    if (proposalBodyDigest(state.proposal) !== state.proposal.digest) {
      fail('proposal body has been tampered post-signing: digest mismatch');
    }
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

    const writer = journalWriter(request.target);
    // TOFU at approval is re-verified at commit: the inventory digest
    // propose captured is a snapshot of the world at that moment, not a
    // standing guarantee. Mirrors the catalog-digest re-derivation below.
    // Skipped only when resuming a transaction this same apply already left
    // open (writer.interrupted()) — a crashed run's own disk writes are not
    // third-party drift, and the journal-aware preflights below independently
    // verify those bytes match what the interrupted transaction was writing.
    if (!writer.interrupted()) {
      const freshInventory = inventoryHarness(request.target);
      if (freshInventory.digest !== state.inventory.digest) {
        fail('the repository inventory changed since propose: approval is stale');
      }
    }

    const { catalog, digest } = loadInstalledCatalog(request.target);
    if (digest !== state.release.catalog_digest || digest !== state.proposal.catalog_digest) {
      fail('the skill catalog changed since this proposal: approval is stale');
    }
    const projection = planSkillProjections(request.target, catalog, state.proposal.selected_skills, writer);
    verifySkillBindings(state.proposal, catalog, projection);
    preflightGrafts(request.target, state.proposal.grafts, writer);
    preflightOwnedFiles(request.target, state.proposal.owned_files, writer);
    const removals = planRemovals(request.target, state, projection, writer, catalog);

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
      // Removals run after the graft upserts so each obsolete section is cut
      // from the digest the upsert just produced, not from a stale preimage.
      applyRemovals(request.target, removals, writer, graftDigests);
      for (const owned of state.proposal.owned_files) {
        writer(request.target, owned.path, owned.content, 0o644, owned.preimage_digest === null ? 'create_owned' : 'replace_owned');
        appliedOwnedFiles.push({ path: owned.path, sha256: sha256(owned.content) });
      }
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
        // Recorded, not just returned, so every later check keeps naming the
        // obsolete artifact this apply refused to delete.
        ...(removals.unreconciled.length ? { unreconciled: removals.unreconciled } : {}),
      },
      checks: null,
      last_error: null,
    };
    writeIfChanged(request.target, '.rig/grafts.md', renderGrafts(next));
    writeState(request.target, next);
    // Closing the journal AFTER writeState ensures a crash between the last
    // payload write and state advance leaves an open transaction; the next
    // apply then treats the landed bytes as its own unfinished work rather
    // than a stale preimage from another owner.
    writer.finish();
    return response('apply', request.target, next, { warnings: unreconciledWarnings(next) });
  });
}

function unreconciledWarnings(state) {
  return (state.applied?.unreconciled || []).map((row) => ({
    code: 'unreconciled', path: row.path, detail: row.detail,
  }));
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
  // A ledger row only proves the SKILL.md still holds the bytes the ledger
  // itself echoed. Re-derive the whole projected tree and compare it to the
  // digest the approval was granted for, so an edited sibling — or a file
  // smuggled into a projected skill directory after apply — is caught too.
  const rootsBySkill = new Map();
  for (const row of projectionRows) {
    const roots = rootsBySkill.get(row.skill) || new Set();
    roots.add(path.posix.dirname(row.path));
    rootsBySkill.set(row.skill, roots);
  }
  for (const binding of state.proposal?.skill_bindings || []) {
    const roots = [...(rootsBySkill.get(binding.id) || [])].sort();
    if (!roots.length) {
      hardFailures.push(failure('state-incomplete', '.rig/state.json', `approved skill "${binding.id}" has no recorded projection`));
      continue;
    }
    const entries = roots.flatMap((root) => liveFilesUnder(target, root)
      .map((rel) => ({ path: rel.slice(root.length + 1), sha256: currentDigest(target, rel) })));
    if (projectedDigest(entries) !== binding.projected_digest) {
      hardFailures.push(failure('state-incomplete', roots[0], `projected bytes for skill "${binding.id}" no longer match the approved projected_digest`));
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
      warnings: [...supplemental.warnings, ...unreconciledWarnings(state)],
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
