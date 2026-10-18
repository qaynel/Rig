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
const { bindServices, serviceOutputPreimages, preflightServices, applyServices, checkServices } = require('./service-catalogue');
const { fetchUpstreamSync, loadUpstream } = require('./upstream-fetch');
const { runProjectionScript, assertOutputOutsideProtected } = require('./projection-script');
const {
  NATIVE_SKILL_SCOPES, INSTRUCTION_ONLY_SCOPE, canonicalSkillName, scopedSkillName, projectSkillFiles,
} = require('./project');
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
  // An empty list is a legitimate installed state (a bare/no-adapter
  // install) — installedSkillScopes below reports the real "no discovery
  // scope available" failure if a proposal then tries to project a skill
  // into it. Only a missing or malformed field is this function's own error.
  if (!Array.isArray(hosts) || !hosts.every((id) => typeof id === 'string')) {
    fail('the installed release marker (.rig/release.json) has no valid "hosts" list; re-run the installer');
  }
  return hosts;
}

// Native skill-discovery scopes come from the one table project() installs
// through (Codex and Claude have a Rig-managed native skill directory); a scope
// applies only when its installed wrapper marker is present.
function nativeScope(target, host) {
  const scope = NATIVE_SKILL_SCOPES[host];
  if (scope && fs.existsSync(containedPath(target, `${scope.root}/rig-onboarding/SKILL.md`))) return { ...scope };
  return null;
}

// Every non-native installed host shares one instruction-only scope keyed by
// the canonical playbook marker, not by which host triggered it — not just
// the hosts in INSTRUCTION_ONLY_HOSTS (that registry set gates whether the
// *installer* stages the shared core-skill copies there, a separate,
// aggregate-across-all-selected-hosts decision made at install time). A host
// with no Rig-managed native skill directory (nativeScope returns null) always
// falls back here when the playbook exists, exactly as the pre-per-host
// aggregate check did — narrowing this to registry membership would silently
// drop optional-skill projection for any host outside that set (e.g.
// copilot-cli, pi) even though the playbook and the runtime skill shelf are
// both present and usable.
function instructionOnlyScope(target, _host) {
  if (!fs.existsSync(containedPath(target, PLAYBOOK_REL))) return null;
  return { ...INSTRUCTION_ONLY_SCOPE };
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

// Selected skills keep their canonical, scope-independent identity; naming and
// frontmatter rewriting per scope are project()'s (rig/lib/project.js).
function skillIdentity(skill) {
  return canonicalSkillName(skill.name);
}

function assertRewriteable(bytes) {
  if (!/^(---\n(?:(?!---\n)[^\n]*\n)*?name:\s*)[^\n]+/m.test(bytes.toString('utf8'))) {
    fail('selected skill has no rewriteable frontmatter name');
  }
}

function sourceFiles(root, prefix = '') {
  const files = [];
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'node_modules') continue;
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const absolute = path.join(root, entry.name);
    if (entry.isDirectory()) files.push(...sourceFiles(absolute, rel));
    else if (!entry.name.endsWith('.tmpl') && entry.name !== 'TODOS-format.md') files.push({ rel, bytes: fs.readFileSync(absolute), mode: fs.statSync(absolute).mode & 0o777 });
  }
  return files;
}

function optionalProjectionSource(target, skill, cache) {
  if (skill.source_kind !== 'optional' || !skill.source_rel.startsWith('rig/catalog/skills/')) {
    fail(`selected skill "${skill.id}" is not an installed optional runtime skill`);
  }
  const installed = `.rig/runtime/rig/${skill.source_rel.slice('rig/'.length)}`;
  const skillFile = containedPath(target, installed);
  if (fs.existsSync(skillFile)) return sourceFiles(path.dirname(skillFile)); // v5 compatibility
  const id = 'gstack-shelf';
  const meta = loadUpstream(id, containedPath(target, '.rig/upstream'));
  const prefix = skill.source_rel.slice('rig/catalog/skills/'.length).replace(/SKILL\.md$/, '');
  const receiptPath = containedPath(target, `.rig/fetched/${id}/receipt.json`);
  let files;
  if (fs.existsSync(receiptPath)) {
    files = new Map();
    for (const row of meta.files.filter((row) => row.output.startsWith(prefix))) {
      const file = containedPath(target, `.rig/fetched/${id}/${row.output}`);
      if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== row.final_sha256) fail(`fetched skill "${skill.id}" has changed; rebuild its proposal`);
      files.set(row.output, fs.readFileSync(file));
    }
  } else {
    if (!cache.has(id)) {
      const result = fetchUpstreamSync(id, { metaDir: containedPath(target, '.rig/upstream'), licencePath: containedPath(target, '.rig/skills/LICENSE.upstream') });
      if (result.status !== 'ok') fail(`upstream fetch refused (${result.gaps[0].code}): ${result.gaps[0].detail}`);
      cache.set(id, result.files);
    }
    files = cache.get(id);
  }
  const modes = new Map(meta.files.map((row) => [row.output, row.mode]));
  return [...files].filter(([output]) => output.startsWith(prefix)).map(([output, bytes]) => ({ rel: output.slice(prefix.length), bytes, mode: modes.get(output) || 0o644 }));
}

function optionalSharedSource(target, cache) {
  const id = 'gstack-shelf';
  const meta = loadUpstream(id, containedPath(target, '.rig/upstream'));
  const receiptPath = containedPath(target, `.rig/fetched/${id}/receipt.json`);
  let files;
  if (fs.existsSync(receiptPath)) {
    files = new Map();
    for (const row of meta.files.filter((row) => row.output.startsWith('plumbing/'))) {
      const file = containedPath(target, `.rig/fetched/${id}/${row.output}`);
      if (!fs.existsSync(file) || sha256(fs.readFileSync(file)) !== row.final_sha256) fail(`fetched shared helper "${row.output}" has changed; rebuild its proposal`);
      files.set(row.output, fs.readFileSync(file));
    }
  } else {
    if (!cache.has(id)) {
      const result = fetchUpstreamSync(id, { metaDir: containedPath(target, '.rig/upstream'), licencePath: containedPath(target, '.rig/skills/LICENSE.upstream') });
      if (result.status !== 'ok') fail(`upstream fetch refused (${result.gaps[0].code}): ${result.gaps[0].detail}`);
      cache.set(id, result.files);
    }
    files = cache.get(id);
  }
  const modes = new Map(meta.files.map((row) => [row.output, row.mode]));
  return [...files].filter(([output]) => output.startsWith('plumbing/')).map(([output, bytes]) => ({ rel: output.slice('plumbing/'.length), bytes, mode: modes.get(output) || 0o644 }));
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
  const sourceCache = new Map();
  const record = (skill, rel, digest) => {
    const entries = projectedFiles.get(skill.id) || [];
    entries.push({ path: rel, sha256: digest });
    projectedFiles.set(skill.id, entries);
  };
  for (const skill of skills) {
    const canonicalName = skillIdentity(skill);
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
    const files = optionalProjectionSource(target, skill, sourceCache);
    const skillFile = files.find(({ rel }) => rel === 'SKILL.md');
    if (!skillFile) fail(`selected skill "${skill.id}" has no SKILL.md`);
    assertRewriteable(skillFile.bytes);
    for (const scope of scopes) {
      const name = scopedSkillName(canonicalName, scope);
      const projected = projectSkillFiles({ files, dir: `${scope.root}/${name}`, declaredName: name });
      projected.forEach(({ path: rel, bytes, mode }, index) => {
        if (writer) cleanProjection(target, writer, rel);
        plans.push({ skill: skill.id, rel, bytes, mode, ownership: currentDigest(target, rel) === null ? 'create_owned' : 'replace_owned' });
        record(skill, files[index].rel, sha256(bytes));
        if (files[index].rel === 'SKILL.md') {
          rows.push({ skill: skill.id, host_scope: scope.host_scope, path: rel, sha256: sha256(bytes) });
        }
      });
    }
  }
  if (skills.some((skill) => skill.source_kind === 'optional')) {
    for (const file of optionalSharedSource(target, sourceCache)) {
      const rel = `.rig/plumbing/${file.rel}`;
      if (writer) cleanProjection(target, writer, rel);
      plans.push({ skill: null, rel, bytes: file.bytes, mode: file.mode, ownership: currentDigest(target, rel) === null ? 'create_owned' : 'replace_owned' });
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

// Approved script outputs are repository files, not `.rig/` artifacts: the
// approval pinned the digest each one had when it was approved. A file that
// moved since is the user's, not ours to overwrite.
function preflightScriptOutputs(target, slot, writer) {
  for (const output of slot.approved_outputs) {
    assertOutputOutsideProtected(target, output.path);
    const digest = currentDigest(target, output.path);
    if (digest !== null && journalResumeDigest(writer, output.path) === digest) continue;
    if (digest !== output.preimage_digest) fail(`projection output "${output.path}" has a stale preimage digest`);
    if (digest !== null && (!writer.latest(output.path) || writer.latest(output.path).digest !== digest)) {
      fail(`projection output "${output.path}" is not journal-proven Rig ownership`);
    }
  }
}

const UPSTREAM_META_REL = '.rig/upstream';
const UPSTREAM_LICENCE_REL = '.rig/skills/LICENSE.upstream';

// The signature binds the pinned archive digest; it must be the digest the
// installed metadata pins, so a proposal cannot ask for a different revision.
function checkUpstreamPins(target, rows) {
  for (const row of rows || []) {
    let meta;
    try { meta = loadUpstream(row.id, containedPath(target, UPSTREAM_META_REL)); } catch (error) { fail(error.message.replace(/^rig: /, '')); }
    if (meta.archive.tar_sha256 !== row.tar_sha256) fail(`upstream "${row.id}" is pinned to a different archive digest than the proposal`);
    if (row.metadata_sha256 !== sha256(fs.readFileSync(containedPath(target, `${UPSTREAM_META_REL}/${row.id}.json`)))) fail(`upstream "${row.id}" metadata digest has changed since proposal`);
  }
}

function fetchedRel(id, output) {
  return `.rig/fetched/${id}/${output}`;
}

// Fetch, verify and patch every requested upstream. Any gap refuses the whole
// apply before a byte is written: a missing capability is never installed.
function fetchApprovedUpstreams(target, rows, writer) {
  const fetched = [];
  for (const row of rows || []) {
    const result = fetchUpstreamSync(row.id, {
      metaDir: containedPath(target, UPSTREAM_META_REL),
      licencePath: containedPath(target, UPSTREAM_LICENCE_REL),
    });
    if (result.status !== 'ok') {
      const first = result.gaps[0];
      fail(`upstream fetch refused (${first.code}): ${first.detail}${first.guidance ? ` — ${first.guidance}` : ''}`);
    }
    for (const output of result.files.keys()) cleanProjection(target, writer, fetchedRel(row.id, output));
    cleanProjection(target, writer, fetchedRel(row.id, 'receipt.json'));
    fetched.push(result);
  }
  return fetched;
}

function scriptRel(slot) {
  return `.rig/projections/${slot.host}.js`;
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
      ...(previous?.migration ? { migration: previous.migration } : {}),
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
    const proposed = { ...request.proposal };
    const upstreams = [...(proposed.upstream_fetch || [])];
    if (selectedCatalogSkills(catalog, proposed.selected_skills || []).some((skill) => skill.source_kind === 'optional') && !upstreams.some((row) => row.id === 'gstack-shelf')) {
      const meta = loadUpstream('gstack-shelf', containedPath(request.target, UPSTREAM_META_REL));
      upstreams.push({ id: 'gstack-shelf', tar_sha256: meta.archive.tar_sha256 });
    }
    if (upstreams.length) proposed.upstream_fetch = upstreams.map((row) => ({ ...row, metadata_sha256: sha256(fs.readFileSync(containedPath(request.target, `${UPSTREAM_META_REL}/${row.id}.json`))) }));
    const stored = canonicalProposal(
      proposed, state, sha256(Buffer.from(summary)),
      (selected) => skillBindings(request.target, catalog, selected),
      (selected) => bindServices(request.target, selected),
      () => serviceOutputPreimages(request.target),
    );
    checkUpstreamPins(request.target, stored.upstream_fetch);
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
  const removals = { projections: [], services: [], grafts: [], unreconciled: [] };
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
  const desiredServices = new Set(Object.keys(state.proposal.service_bindings || {}));
  for (const row of state.applied?.owned_files || []) {
    if (!row.path.startsWith('.rig/services/') || !row.path.endsWith('.md')) continue;
    const id = row.path.slice('.rig/services/'.length, -'.md'.length);
    if (desiredServices.has(id)) continue;
    const live = currentDigest(target, row.path);
    if (live !== null && live !== row.sha256) {
      removals.unreconciled.push({ path: row.path, detail: HAND_EDITED });
      continue;
    }
    removals.services.push({ path: row.path, digest: live, root: '.rig/services' });
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
  for (const row of removals.services) {
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

    // Tag the transaction with this proposal's digest so a resumed run can
    // tell its own crashed attempt apart from an unrelated interrupted
    // transaction (a different, superseded proposal, or the installer)
    // sharing the same repo-wide journal — an unscoped boolean would let a
    // stale, unrelated interruption suppress the freshness check below.
    const writer = journalWriter(request.target, { transactionOwner: state.proposal.digest });
    // TOFU at approval is re-verified at commit: the inventory digest
    // propose captured is a snapshot of the world at that moment, not a
    // standing guarantee. Mirrors the catalog-digest re-derivation below.
    // Skipped only when resuming a transaction *this proposal* already left
    // open — a crashed run's own disk writes are not third-party drift, and
    // the journal-aware preflights below independently verify those bytes
    // match what the interrupted transaction was writing.
    const resumingThisProposal = writer.interrupted() && writer.interruptedOwner() === state.proposal.digest;
    if (!resumingThisProposal) {
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
    preflightServices(request.target, state.proposal, writer);
    // The agent-script slot: every check above has already passed and the
    // approval is verified, so this is the first moment the approved bytes may
    // run. A refusal (no sandbox, bad artifact) throws here, before any write.
    const slot = state.proposal.projection_script || null;
    let scriptRun = null;
    if (slot) {
      preflightScriptOutputs(request.target, slot, writer);
      scriptRun = runProjectionScript({ target: request.target, slot });
      preflightScriptOutputs(request.target, slot, writer);
    }
    checkUpstreamPins(request.target, state.proposal.upstream_fetch);
    const fetchedUpstreams = fetchApprovedUpstreams(request.target, state.proposal.upstream_fetch, writer);
    const removals = planRemovals(request.target, state, projection, writer, catalog);

    const graftDigests = new Map();
    const appliedGrafts = [];
    const appliedOwnedFiles = [];
    try {
      for (const projectionFile of projection.plans) {
        writer(request.target, projectionFile.rel, projectionFile.bytes, projectionFile.mode || 0o644, projectionFile.ownership);
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
      appliedOwnedFiles.push(...applyServices(request.target, state.proposal, writer, currentDigest));
      for (const result of fetchedUpstreams) {
        for (const [output, bytes] of result.files) {
          const rel = fetchedRel(result.id, output);
          const pinned = result.receipt.files.find((file) => file.path === output);
          writer(request.target, rel, bytes, pinned?.mode || 0o644, currentDigest(request.target, rel) === null ? 'create_owned' : 'replace_owned');
        }
        const receiptRel = fetchedRel(result.id, 'receipt.json');
        writer(request.target, receiptRel, `${JSON.stringify(result.receipt, null, 2)}\n`, 0o644, currentDigest(request.target, receiptRel) === null ? 'create_owned' : 'replace_owned');
      }
      if (slot) {
        // The approved script itself is kept (reviewable, re-runnable, and
        // offerable back to Rig as a projector), then its approved artifacts.
        writer(request.target, scriptRel(slot), slot.source, 0o644, currentDigest(request.target, scriptRel(slot)) === null ? 'create_owned' : 'replace_owned');
        for (const artifact of scriptRun.artifacts) {
          const approved = slot.approved_outputs.find((row) => row.path === artifact.path);
          writer(request.target, artifact.path, artifact.bytes, 0o644, approved.preimage_digest === null ? 'create_owned' : 'replace_owned');
        }
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
        projection_files: projection.plans.map((file) => ({ path: file.rel, sha256: sha256(file.bytes), mode: file.mode || 0o644 })),
        grafts: appliedGrafts.sort((a, b) => a.path.localeCompare(b.path) || a.capability.localeCompare(b.capability)),
        owned_files: appliedOwnedFiles.sort((a, b) => a.path.localeCompare(b.path)),
        ...(fetchedUpstreams.length ? {
          upstream: fetchedUpstreams.map((result) => ({
            id: result.id,
            revision: result.receipt.revision,
            tar_sha256: result.receipt.tar_sha256,
            receipt_path: fetchedRel(result.id, 'receipt.json'),
            receipt_sha256: sha256(`${JSON.stringify(result.receipt, null, 2)}\n`),
            files: result.receipt.files.map((file) => ({ path: fetchedRel(result.id, file.path), sha256: file.sha256, mode: file.mode })),
          })),
        } : {}),
        ...(slot ? {
          projection_script: {
            host: slot.host,
            script_digest: slot.script_digest,
            script_path: scriptRel(slot),
            outputs: scriptRun.artifacts.map((artifact) => ({ path: artifact.path, sha256: sha256(artifact.bytes) })),
          },
        } : {}),
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
  for (const row of state.applied.projection_files || []) {
    if (currentDigest(target, row.path) !== row.sha256 || (fs.statSync(containedPath(target, row.path)).mode & 0o777) !== row.mode) {
      hardFailures.push(failure('state-incomplete', row.path, 'selected skill file is missing, changed, or has a changed mode'));
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
  for (const upstream of state.applied.upstream || []) {
    const approved = (state.proposal?.upstream_fetch || []).find((row) => row.id === upstream.id);
    if (!approved || approved.tar_sha256 !== upstream.tar_sha256) {
      hardFailures.push(failure('state-incomplete', '.rig/state.json', `applied upstream "${upstream.id}" is not the approved pin`));
    }
    for (const file of [...upstream.files, { path: upstream.receipt_path, sha256: upstream.receipt_sha256 }]) {
      const live = currentDigest(target, file.path);
      if (live === null || (file.sha256 !== null && live !== file.sha256)) {
        hardFailures.push(failure('state-incomplete', file.path, `fetched upstream "${upstream.id}" file is missing or has changed`));
      }
      if (file.mode !== undefined && live !== null && (fs.statSync(containedPath(target, file.path)).mode & 0o777) !== file.mode) {
        hardFailures.push(failure('state-incomplete', file.path, `fetched upstream "${upstream.id}" file mode has changed`));
      }
    }
    try {
      const receipt = JSON.parse(fs.readFileSync(containedPath(target, upstream.receipt_path), 'utf8'));
      if (receipt.id !== upstream.id || receipt.revision !== upstream.revision || receipt.tar_sha256 !== upstream.tar_sha256
        || !Array.isArray(receipt.files) || receipt.files.some((file) => !upstream.files.some((expected) => expected.path === fetchedRel(upstream.id, file.path) && expected.sha256 === file.sha256 && expected.mode === file.mode))) {
        hardFailures.push(failure('upstream-receipt-invalid', upstream.receipt_path, `fetched upstream "${upstream.id}" receipt does not match applied evidence`));
      }
    } catch {
      hardFailures.push(failure('upstream-receipt-invalid', upstream.receipt_path, `fetched upstream "${upstream.id}" receipt is unreadable`));
    }
  }
  const scriptApplied = state.applied.projection_script;
  if (scriptApplied) {
    const approved = state.proposal?.projection_script;
    if (!approved || approved.script_digest !== scriptApplied.script_digest) {
      hardFailures.push(failure('state-incomplete', '.rig/state.json', 'the applied projection script is not the approved one'));
    }
    if (currentDigest(target, scriptApplied.script_path) !== scriptApplied.script_digest) {
      hardFailures.push(failure('state-incomplete', scriptApplied.script_path, 'the approved projection script is missing or has changed'));
    }
    for (const row of scriptApplied.outputs) {
      if (currentDigest(target, row.path) !== row.sha256) {
        hardFailures.push(failure('state-incomplete', row.path, 'a projection script output is missing or has changed'));
      }
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
    const serviceChecks = hardFailures.length ? { executed_count: 0, results: [] } : checkServices(request.target, state.proposal);
    for (const result of serviceChecks.results) if (result.status !== 0) {
      hardFailures.push(failure('service-check-failed', result.service_id, result.reason || 'service check failed'));
    }
    const checks = {
      status: hardFailures.length ? 'fail' : 'pass',
      hard_failures: hardFailures,
      warnings: [...supplemental.warnings, ...unreconciledWarnings(state)],
      weight: supplemental.weight,
      ...(state.proposal?.selected_services === undefined ? {} : { service_checks: serviceChecks }),
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
    try {
      writeState(request.target, next);
    } catch (error) {
      // A detected state edit is evidence of tampering. Return the failed
      // reconciliation without overwriting the edited state that must be
      // repaired by its owner.
      if (hardFailures.length && error.message === 'rig: edited evidence .rig/state.json') {
        return response('check', request.target, next, { hard_failures: hardFailures, warnings: checks.warnings });
      }
      throw error;
    }
    return response('check', request.target, next, { hard_failures: hardFailures, warnings: checks.warnings });
  });
}

// Called by the v5 -> corpus migration after the new layout is on disk. The
// repository's valid selections survive; any approval, applied or checked
// result whose bytes the new layout changed is invalidated, so the old
// apply early return can never claim the new layout was applied.
function migrateState(target, { fromTag, toTag }) {
  return withOnboardingLock(target, () => {
    const state = readState(target);
    if (!state) return { status: 'none' };
    if (state.migration?.to === toTag) return { status: 'already-migrated' };
    const invalidated = [];
    let catalogInfo = null;
    try { catalogInfo = loadInstalledCatalog(target); } catch { invalidated.push('catalog-unreadable'); }
    if (catalogInfo && catalogInfo.digest !== state.release.catalog_digest) invalidated.push('catalog-digest');
    const proposal = state.proposal;
    let selected = proposal ? proposal.selected_skills : [];
    if (catalogInfo && proposal) {
      const known = new Set(catalogInfo.catalog.skills.flatMap((skill) => [skill.id, skill.name]));
      selected = selected.filter((id) => known.has(id));
      if (selected.length !== proposal.selected_skills.length) invalidated.push('selected-skill-removed');
      try {
        const now = new Map(skillBindings(target, catalogInfo.catalog, selected).map((row) => [row.id, row]));
        for (const binding of proposal.skill_bindings || []) {
          const row = now.get(binding.id);
          if (!row || row.tree_digest !== binding.tree_digest || row.projected_digest !== binding.projected_digest) invalidated.push(`binding:${binding.id}`);
        }
      } catch { invalidated.push('bindings-unverifiable'); }
    }
    const preserved = proposal ? {
      selected_skills: selected,
      capabilities: proposal.capabilities,
      grafts: proposal.grafts.map(({ capability, path: graftPath, version, content }) => ({ capability, path: graftPath, version, content })),
      owned_files: proposal.owned_files.map(({ path: filePath, kind }) => ({ path: filePath, kind })),
      ...(proposal.upstream_fetch ? { upstream_fetch: proposal.upstream_fetch } : {}),
      ...(proposal.projection_script ? { projection_script: { host: proposal.projection_script.host, script_digest: proposal.projection_script.script_digest } } : {}),
    } : null;
    const migration = {
      from: fromTag, to: toTag, invalidated, preserved_selection: preserved,
    };
    if (!invalidated.length) {
      writeState(target, { ...state, revision: state.revision + 1, release: { ...state.release, version: toTag }, migration });
      return { status: 'kept', invalidated };
    }
    writeState(target, {
      ...state,
      revision: state.revision + 1,
      phase: 'prepared',
      release: { version: toTag, catalog_digest: catalogInfo ? catalogInfo.digest : state.release.catalog_digest },
      proposal: null,
      approval: null,
      checks: null,
      last_error: null,
      migration,
    });
    return { status: 'invalidated', invalidated };
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
  migrateState, ALLOWED_SIGNERS_REL, APPROVAL_NAMESPACE, approvalMessage, handleOnboarding, loadInstalledCatalog,
};
