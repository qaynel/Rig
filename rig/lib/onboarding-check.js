'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { parseGraftSections, enumerateGraftMarkers } = require('./payload');
const { containedPath } = require('./path-safety');

const PROJECTION_ROOTS = ['.agents/skills', '.claude/skills', '.rig/skills'];

function failure(code, pathValue, detail) {
  return { code, path: pathValue, detail };
}

function readJournal(target) {
  const file = containedPath(target, '.rig/install-manifest.jsonl');
  if (!fs.existsSync(file)) return { latest: new Map(), bytes: 0 };
  const latest = new Map();
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!line.trim()) continue;
    try {
      const record = JSON.parse(line);
      if (Number.isInteger(record.seq) && record.path) latest.set(record.path, record);
    } catch {
      // The install journal is append-only; malformed history is not allowed
      // to make the current weight look smaller.
    }
  }
  return { latest, bytes: fs.statSync(file).size };
}

function walkFiles(root, out = []) {
  if (!fs.existsSync(root)) return out;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const file = path.join(root, entry.name);
    if (entry.isDirectory()) walkFiles(file, out);
    else if (entry.isFile()) out.push(file);
  }
  return out;
}

function managedBytes(file, record) {
  const bytes = fs.readFileSync(file);
  if (record.ownership === 'graft_managed') {
    try {
      const sections = parseGraftSections(bytes).sections;
      const wanted = new Set((record.managed_grafts || []).map(({ capability }) => capability));
      return sections
        .filter(({ capability }) => wanted.has(capability))
        .reduce((total, section) => total + section.end - section.start, 0);
    } catch {
      return 0;
    }
  }
  const text = bytes.toString('utf8');
  if (record.managed_line) {
    const escaped = String(record.managed_line).replace(/[.*+?^${}()|[\[\]\\]/g, '\\$&');
    const match = text.match(new RegExp(`(?:^|\\n)${escaped}(?:\\r?\\n|$)`));
    return match ? Buffer.byteLength(match[0].replace(/^\n/, ''), 'utf8') : 0;
  }
  if (record.managed_block) {
    const start = text.indexOf(`# rig:${record.managed_block}:start`);
    const endMarker = `# rig:${record.managed_block}:end`;
    const end = text.indexOf(endMarker, start);
    if (start !== -1 && end !== -1) return Buffer.byteLength(text.slice(start, end + endMarker.length), 'utf8');
  }
  return 0;
}

function calculateWeight(target, catalog, journal) {
  let files = 0;
  let bytes = 0;
  for (const record of journal.latest.values()) {
    if (record.state !== 'applied') continue;
    const file = containedPath(target, record.path);
    if (!fs.existsSync(file) || !fs.statSync(file).isFile()) continue;
    files += 1;
    bytes += ['append_managed', 'graft_managed'].includes(record.ownership)
      ? managedBytes(file, record)
      : fs.statSync(file).size;
  }

  // The ledger and preimages are the unavoidable attributable overhead of a
  // journaled install, so include them even though they have no projection.
  const journalFile = containedPath(target, '.rig/install-manifest.jsonl');
  if (fs.existsSync(journalFile)) {
    files += 1;
    bytes += journal.bytes;
  }

  const budget = catalog.soft_budget || {};
  return {
    files,
    bytes,
    previous_release_files: Number.isFinite(budget.files) ? budget.files : 0,
    previous_release_bytes: Number.isFinite(budget.bytes) ? budget.bytes : 0,
  };
}

function budgetWarnings(weight, catalog) {
  const warnings = [];
  if (catalog.soft_budget?.basis !== 'previous-release') return warnings;
  if (weight.previous_release_files > 0 && weight.files > weight.previous_release_files) {
    warnings.push({
      code: 'payload-file-growth',
      detail: `previous release ${weight.previous_release_files}; current ${weight.files}; delta +${weight.files - weight.previous_release_files}`,
    });
  }
  if (weight.previous_release_bytes > 0 && weight.bytes > weight.previous_release_bytes) {
    warnings.push({
      code: 'payload-byte-growth',
      detail: `previous release ${weight.previous_release_bytes}; current ${weight.bytes}; delta +${weight.bytes - weight.previous_release_bytes}`,
    });
  }
  return warnings;
}

function projectionFailures(target, state, journal) {
  const failures = [];
  const realTarget = fs.realpathSync(target);
  const skills = state.applied?.skills || [];
  const destinations = new Map();
  const projections = new Map();
  for (const row of skills) {
    const priorDestination = destinations.get(row.path);
    if (priorDestination) {
      failures.push(failure('duplicate-destination', row.path, `skills "${priorDestination.skill}" and "${row.skill}" own the same destination`));
    } else destinations.set(row.path, row);
    const projectionKey = `${row.host_scope}\0${row.skill}`;
    if (projections.has(projectionKey)) {
      failures.push(failure('duplicate-skill-projection', row.path, `skill "${row.skill}" is projected more than once for host "${row.host_scope}"`));
    } else projections.set(projectionKey, row);

    const file = containedPath(target, row.path);
    if (!fs.existsSync(file)) continue;
    const name = fs.readFileSync(file, 'utf8').match(/^name:\s*(\S+)\s*$/m)?.[1];
    const expected = path.basename(path.dirname(row.path));
    if (name !== expected) {
      failures.push(failure('skill-name-mismatch', row.path, `directory "${expected}" declares "${name || 'no name'}"`));
    }
  }

  const graftPaths = new Set();
  for (const row of state.applied?.grafts || []) {
    if (graftPaths.has(row.path)) continue;
    graftPaths.add(row.path);
    const file = containedPath(target, row.path);
    if (!fs.existsSync(file)) continue;
    try {
      parseGraftSections(fs.readFileSync(file));
    } catch (error) {
      const code = /duplicates capability/i.test(error.message) ? 'duplicate-graft' : 'malformed-graft';
      failures.push(failure(code, row.path, error.message));
    }
  }

  const allowed = new Set([...journal.latest.values()]
    .filter((record) => record.state === 'applied')
    .map((record) => record.path));
  for (const relativeRoot of PROJECTION_ROOTS) {
    const root = containedPath(target, relativeRoot);
    for (const file of walkFiles(root)) {
      const relative = path.relative(realTarget, file).split(path.sep).join('/');
      const parts = relative.split('/');
      if (parts[2] && parts[2].startsWith('rig-') && !allowed.has(relative)) {
        failures.push(failure('unapproved-write', relative, 'current Rig projection is not present in the applied journal'));
      }
    }
  }

  for (const relativeRoot of ['.agents/skills', '.claude/skills']) {
    const root = containedPath(target, relativeRoot);
    for (const file of walkFiles(root)) {
      const relative = path.relative(realTarget, file).split(path.sep).join('/');
      if (relative.split('/')[2] === 'rig-rig') {
        failures.push(failure('self-prefix-regression', relative, 'the canonical rig skill must not be projected as rig-rig'));
      }
    }
  }
  return failures;
}

function danglingReferences(target) {
  const failures = [];
  const seen = new Set();
  const files = [
    'AGENTS.md', 'CLAUDE.md', 'GEMINI.md',
    '.agents/rules/rig.md', '.claude/skills/rig-onboarding/SKILL.md',
    '.agents/skills/rig-onboarding/SKILL.md', '.rig/skills/onboarding/SKILL.md',
  ].map((rel) => containedPath(target, rel)).filter((file) => fs.existsSync(file));
  const realTarget = fs.realpathSync(target);
  for (const file of files) {
    let text;
    try { text = fs.readFileSync(file, 'utf8'); } catch { continue; }
    for (const match of text.matchAll(/\.rig\/[A-Za-z0-9._/-]+/g)) {
      const rel = match[0].replace(/[),.;:]+$/, '');
      if (seen.has(rel)) continue;
      seen.add(rel);
      if (!fs.existsSync(containedPath(target, rel))) {
        failures.push(failure('dangling-reference', rel, `reference from ${path.relative(realTarget, file)} does not resolve`));
      }
    }
  }
  return failures;
}

// Compare every live Rig graft marker in the repository against the set of
// tuples that were approved and applied. Any extra (path, capability) tuple is
// reported as a hard failure. The check intentionally does NOT auto-remove the
// section — the operator must inspect it and either re-run propose/apply to
// include it or remove it manually. The marker text is left as forensic
// evidence until then.
function unapprovedGraftFailures(target, state) {
  const approvedSet = new Set(
    (state.applied?.grafts || []).map(({ path: p, capability }) => `${p}\0${capability}`),
  );
  const failures = [];
  for (const { rel, capability } of enumerateGraftMarkers(target)) {
    if (!approvedSet.has(`${rel}\0${capability}`)) {
      failures.push(failure(
        'unapproved-graft',
        rel,
        `live graft "${capability}" at "${rel}" is not in applied state; ` +
        'remove it manually or re-run propose/apply to include it',
      ));
    }
  }
  return failures;
}

function checkOnboarding(target, state, catalog) {
  const journal = readJournal(target);
  const hardFailures = [
    ...projectionFailures(target, state, journal),
    ...danglingReferences(target),
    ...unapprovedGraftFailures(target, state),
  ];
  const weight = calculateWeight(target, catalog, journal);
  return { hardFailures, warnings: budgetWarnings(weight, catalog), weight };
}

module.exports = { checkOnboarding };
