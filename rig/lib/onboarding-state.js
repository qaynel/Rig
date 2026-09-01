'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { canonical, sha256 } = require('./skill-catalog');
const { containedPath } = require('./path-safety');

const STATE_REL = '.rig/state.json';

const ALLOWED_STATE_KEYS = new Set([
  'applied', 'approval', 'checks', 'inventory', 'last_error',
  'phase', 'proposal', 'release', 'revision', 'schema_version',
]);

const VALID_PHASES = new Set([
  'applied', 'approved', 'applying', 'checked', 'failed',
  'needs-decision', 'prepared', 'proposed',
]);

const DIGEST_RE = /^[0-9a-f]{64}$/;

const SUMMARY_HEADINGS = [
  'Existing state', 'Rig interpretation', 'Reuse', 'Grafts and improvements',
  'New capabilities', 'Important decisions', 'Resulting pipeline', 'Expected user experience',
];

function fail(message) {
  throw new Error(`rig: onboarding ${message}`);
}

function jsonText(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function atomicWrite(target, rel, contents) {
  const file = containedPath(target, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.tmp`;
  fs.writeFileSync(temporary, contents);
  fs.renameSync(temporary, file);
}

function readJson(file, label) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    fail(`${label} is missing or invalid`);
  }
}

function stateFile(target) {
  return containedPath(target, STATE_REL);
}

function assertDigestOrNull(value, label) {
  if (value !== null && (typeof value !== 'string' || !DIGEST_RE.test(value))) {
    fail(`${label} is not a valid SHA-256 digest`);
  }
}

function strictDecodeState(state) {
  // 1. Reject unknown top-level keys — only the canonical 10 are allowed.
  for (const key of Object.keys(state)) {
    if (!ALLOWED_STATE_KEYS.has(key)) fail(`state has unknown key "${key}"`);
  }

  // 2. Phase must be a known enum value.
  if (!VALID_PHASES.has(state.phase)) {
    fail(`state phase "${state.phase}" is not a valid phase`);
  }

  // 3. Proposal must be null while in the prepared phase — prepare always
  // writes null and only propose advances it.
  if (state.phase === 'prepared' && state.proposal !== null) {
    fail('state proposal must be null in prepared phase');
  }

  // 4 & 5. Validate applied.proposal_digest when applied is present.
  if (state.applied && typeof state.applied === 'object' && !Array.isArray(state.applied)) {
    const apd = state.applied.proposal_digest;

    // 5. Format — must be null or a lowercase hex SHA-256.
    if (apd !== null && apd !== undefined) {
      assertDigestOrNull(apd, 'applied.proposal_digest');
    }

    // 4. Cross-field invariant: the initial state (revision 1, prepared phase)
    // has never been through apply, so applied.proposal_digest must be null.
    if (state.revision === 1 && state.phase === 'prepared' && state.applied.proposal_digest !== null) {
      fail('state applied.proposal_digest must be null in initial prepared state');
    }
  }

  return state;
}

function readState(target) {
  const file = stateFile(target);
  if (!fs.existsSync(file)) return null;
  const state = readJson(file, 'state');
  const keys = ['applied', 'approval', 'checks', 'inventory', 'last_error', 'phase', 'proposal', 'release', 'revision', 'schema_version'];
  if (!state || state.schema_version !== 1 || !Number.isInteger(state.revision) || state.revision < 1
    || !keys.every((key) => Object.hasOwn(state, key))) fail('state schema is invalid');
  strictDecodeState(state);
  return state;
}

function writeState(target, state) {
  atomicWrite(target, STATE_REL, jsonText(state));
}

function safeRelativePath(rel, label = 'path') {
  if (typeof rel !== 'string' || !rel || rel.includes('\0') || rel.includes('\\') || path.posix.isAbsolute(rel)) {
    fail(`${label} is invalid`);
  }
  const parts = rel.split('/');
  if (parts.some((part) => !part || part === '.' || part === '..')) fail(`${label} is invalid`);
  return rel;
}

function exactKeys(value, keys, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} is invalid`);
  for (const key of Object.keys(value)) if (!keys.has(key)) fail(`${label} has unknown key "${key}"`);
}

function sortedStrings(value, label) {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) fail(`${label} is invalid`);
  return [...value].sort();
}

function validateSummary(summary) {
  if (typeof summary !== 'string') fail('summary is invalid');
  if (!summary.startsWith('# Rig onboarding summary\n')) fail('summary heading is invalid');
  const headings = [...summary.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1]);
  if (headings.length !== SUMMARY_HEADINGS.length || headings.some((heading, index) => heading !== SUMMARY_HEADINGS[index])) {
    fail('summary headings are invalid');
  }
  return summary;
}

function validateCapability(row) {
  exactKeys(row, new Set(['capability', 'family', 'disposition', 'existing_paths', 'rig_skills', 'reason']), 'capability');
  if (typeof row.capability !== 'string' || typeof row.family !== 'string' || typeof row.disposition !== 'string' || typeof row.reason !== 'string') {
    fail('capability is invalid');
  }
  return {
    capability: row.capability,
    family: row.family,
    disposition: row.disposition,
    existing_paths: sortedStrings(row.existing_paths, 'capability existing_paths').map((entry) => safeRelativePath(entry, 'capability path')),
    rig_skills: sortedStrings(row.rig_skills, 'capability rig_skills'),
    reason: row.reason,
  };
}

function validateGraft(row) {
  exactKeys(row, new Set(['capability', 'path', 'version', 'content', 'content_digest', 'preimage_digest']), 'graft');
  if (typeof row.capability !== 'string' || row.version !== 1 || typeof row.content !== 'string'
    || typeof row.content_digest !== 'string' || (row.preimage_digest !== null && typeof row.preimage_digest !== 'string')) {
    fail('graft is invalid');
  }
  if (sha256(row.content) !== row.content_digest) fail('graft content digest is invalid');
  return { ...row, path: safeRelativePath(row.path, 'graft path') };
}

function validateOwnedFile(row) {
  exactKeys(row, new Set(['path', 'kind', 'content', 'content_digest', 'preimage_digest']), 'owned file');
  if (typeof row.kind !== 'string' || typeof row.content !== 'string' || typeof row.content_digest !== 'string'
    || (row.preimage_digest !== null && typeof row.preimage_digest !== 'string')) fail('owned file is invalid');
  if (sha256(row.content) !== row.content_digest) fail('owned file content digest is invalid');
  return { ...row, path: safeRelativePath(row.path, 'owned file path') };
}

function validateDecision(row) {
  exactKeys(row, new Set(['id', 'question', 'consequence', 'recommendation', 'status', 'resolution', 'authority']), 'critical decision');
  for (const key of ['id', 'question', 'consequence', 'recommendation', 'status']) {
    if (typeof row[key] !== 'string' || !row[key]) fail('critical decision is invalid');
  }
  if (row.resolution !== undefined && row.resolution !== null && typeof row.resolution !== 'string') fail('critical decision resolution is invalid');
  if (row.authority !== undefined && typeof row.authority !== 'string') fail('critical decision authority is invalid');
  return { ...row };
}

// `bindSkills` receives the canonical selection and returns the per-skill
// digest rows the proposal freezes. It is a callback, not an argument, because
// the binding is derived from the sorted selection and must land inside the
// digested body: what the approver signs has to include the bytes.
function canonicalProposal(input, state, summaryDigest, bindSkills = () => []) {
  exactKeys(input, new Set([
    'inventory_digest', 'catalog_digest', 'capabilities', 'selected_skills', 'grafts', 'owned_files', 'critical_decisions',
    // Accepted so a stored proposal can be resubmitted verbatim, never read:
    // the binding below is always recomputed from the repository.
    'skill_bindings',
  ]), 'proposal');
  if (input.inventory_digest !== state.inventory.digest || input.catalog_digest !== state.release.catalog_digest) {
    fail('proposal inventory or catalog digest is stale');
  }
  if (!Array.isArray(input.capabilities) || !Array.isArray(input.grafts) || !Array.isArray(input.owned_files) || !Array.isArray(input.critical_decisions)) {
    fail('proposal is invalid');
  }
  const selectedSkills = sortedStrings(input.selected_skills, 'proposal selected_skills');
  const body = {
    inventory_digest: input.inventory_digest,
    catalog_digest: input.catalog_digest,
    summary_digest: summaryDigest,
    capabilities: input.capabilities.map(validateCapability).sort((a, b) => a.capability.localeCompare(b.capability)),
    selected_skills: selectedSkills,
    skill_bindings: bindSkills(selectedSkills),
    grafts: input.grafts.map(validateGraft).sort((a, b) => a.path.localeCompare(b.path) || a.capability.localeCompare(b.capability)),
    owned_files: input.owned_files.map(validateOwnedFile).sort((a, b) => a.path.localeCompare(b.path)),
    critical_decisions: input.critical_decisions.map(validateDecision).sort((a, b) => a.id.localeCompare(b.id)),
  };
  return { digest: sha256(canonical(body)), ...body };
}

function cell(value) {
  return String(value ?? '').replace(/\|/g, '\\|').replace(/\r?\n/g, ' ');
}

function table(headers, rows) {
  const header = `| ${headers.join(' | ')} |`;
  const separator = `| ${headers.map(() => '---').join(' | ')} |`;
  return [header, separator, ...rows.map((row) => `| ${row.map(cell).join(' | ')} |`)].join('\n');
}

function renderAdoptedConfig(inventory) {
  const entries = inventory.entries || [];
  const warnings = inventory.warnings || [];
  const configuration = entries.length
    ? table(['Path', 'Host', 'Kind', 'Name', 'Capability tags', 'Bytes', 'SHA-256'], entries.map((entry) => [
      entry.path, entry.host, entry.kind, entry.name, entry.capability_tags.join(', '), entry.bytes, entry.sha256,
    ]))
    : 'None.';
  const warningTable = warnings.length
    ? table(['Path', 'Code', 'Detail'], warnings.map((warning) => [warning.path, warning.code, warning.detail]))
    : 'None.';
  return `# Rig adopted configuration\n\nThis is a structural inventory, not an endorsement.\n\nInventory digest: ${inventory.digest}\nEntries: ${entries.length}; warnings: ${warnings.length}.\n\n## Configuration\n\n${configuration}\n\n## Warnings\n\n${warningTable}\n`;
}

function renderOverlaps(overlaps) {
  const taggedRows = overlaps.tagged.flatMap((entry) => entry.matches.map((match) => [
    entry.path, match.match_tags.join(', '), match.capability, match.skills.join(', '),
  ]));
  const tagged = taggedRows.length
    ? table(['Existing path', 'Match tags', 'Rig capability', 'Rig skills'], taggedRows)
    : 'None.';
  const unmapped = overlaps.unmapped.length
    ? table(['Path', 'Host', 'Kind', 'Name'], overlaps.unmapped.map((entry) => [entry.path, entry.host, entry.kind, entry.name]))
    : 'None.';
  const unmatched = overlaps.unmatchedRigCapabilities.length
    ? overlaps.unmatchedRigCapabilities.map((capability) => `- ${capability}`).join('\n')
    : 'None.';
  return `# Rig overlap hints\n\nThese matches are hints; code takes no action.\n\n## Tagged overlaps\n\n${tagged}\n\n## Unmapped existing entries\n\n${unmapped}\n\n## Rig capabilities without a declared match\n\n${unmatched}\n`;
}

function renderGrafts(state) {
  const grafts = state.applied.grafts || [];
  const skills = state.applied.skills || [];
  const graftRows = grafts.length
    ? table(['Capability', 'Path', 'Marker version', 'Content SHA-256', 'Status'], grafts.map((row) => [
      row.capability, row.path, row.version, row.content_digest, row.status,
    ]))
    : 'None.';
  const skillRows = skills.length
    ? table(['Skill', 'Host scope', 'Path'], skills.map((row) => [row.skill, row.host_scope, row.path]))
    : 'None.';
  return `# Rig applied grafts\n\nProposal digest: ${state.applied.proposal_digest || 'None.'}\n\n## Applied grafts\n\n${graftRows}\n\n## Selected skill projections\n\n${skillRows}\n\n## Warnings\n\nNone.\n`;
}

module.exports = {
  STATE_REL,
  atomicWrite,
  canonicalProposal,
  readState,
  renderAdoptedConfig,
  renderGrafts,
  renderOverlaps,
  safeRelativePath,
  validateSummary,
  writeState,
};
