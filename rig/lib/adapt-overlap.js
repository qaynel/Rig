'use strict';

function strings(values) {
  return [...new Set((values || []).filter((value) => typeof value === 'string' && value))].sort();
}

function canonicalTargets(catalog, migrations) {
  const skills = Array.isArray(catalog?.skills) ? catalog.skills : [];
  const byName = new Map(skills.flatMap((skill) => [[skill.name, skill], [skill.id, skill]]));
  const targets = new Map();
  const add = (alias, skill) => {
    if (typeof alias !== 'string' || !alias || !skill) return;
    const rows = targets.get(alias) || [];
    if (!rows.includes(skill)) rows.push(skill);
    targets.set(alias, rows);
  };
  for (const skill of skills) for (const alias of skill.aliases || []) add(alias, skill);
  const aliases = migrations?.aliases || migrations || {};
  for (const [alias, name] of Object.entries(aliases)) add(alias, byName.get(name));
  return targets;
}

function signalsForEntry(entry, targets) {
  const signals = new Set(strings(entry.capability_tags));
  for (const skill of targets.get(entry.name) || []) {
    signals.add(skill.capability);
  }
  return signals;
}

function signalsForSkill(skill) {
  return new Set(strings([skill.capability, ...(skill.overlap_tags || []), ...(skill.aliases || [])]));
}

// Exact declared metadata only. This returns context for a host agent; it does
// not select, install, or otherwise mutate anything.
function buildOverlaps(inventory, catalog, migrations = {}) {
  const entries = Array.isArray(inventory?.entries) ? inventory.entries : [];
  const skills = Array.isArray(catalog?.skills) ? catalog.skills : [];
  const targets = canonicalTargets(catalog, migrations);
  const tagged = [];
  const unmapped = [];
  const matchedCapabilities = new Set();

  for (const entry of [...entries].sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0))) {
    const entrySignals = signalsForEntry(entry, targets);
    const matches = new Map();
    for (const skill of skills) {
      const matchTags = strings([...entrySignals].filter((tag) => signalsForSkill(skill).has(tag)));
      if (!matchTags.length) continue;
      const row = matches.get(skill.capability) || { capability: skill.capability, match_tags: new Set(), skills: new Set() };
      for (const tag of matchTags) row.match_tags.add(tag);
      row.skills.add(skill.id);
      matches.set(skill.capability, row);
      matchedCapabilities.add(skill.capability);
    }
    if (!matches.size) {
      unmapped.push(entry);
      continue;
    }
    tagged.push({
      path: entry.path,
      matches: [...matches.values()]
        .map((row) => ({ capability: row.capability, match_tags: strings([...row.match_tags]), skills: strings([...row.skills]) }))
        .sort((a, b) => (a.capability < b.capability ? -1 : a.capability > b.capability ? 1 : 0)),
    });
  }

  return {
    tagged,
    unmapped,
    unmatchedRigCapabilities: strings(skills.map((skill) => skill.capability).filter((capability) => !matchedCapabilities.has(capability))),
  };
}

module.exports = { buildOverlaps };
