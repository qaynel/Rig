// Skill-shelf catalogue (Path B F-1 + F-3).
//
// One loader reads the capability hierarchy plus the core workflow skills and
// builds the catalogue object that `scripts/build-skill-catalog.js` writes to
// `rig/catalog/skills/catalog.json` and the payload pins at `.rig/catalog.json`.
// Only bounded, self-declared frontmatter is read; nothing is inferred from a
// directory name, a vendor prefix, or file contents.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.join(__dirname, '..', '..');
const SKILL_ROOT = path.join(ROOT, 'rig', 'catalog', 'skills');
const SKILL_ROOT_REL = 'rig/catalog/skills';
// Files that live beside the family directories and are not skills.
const RESERVED = new Set([
  'LICENSE.upstream', 'UPSTREAM.md', 'README.md',
  'families.json', 'migrations.json', 'catalog.json',
]);

// Core workflow skills keep their established source paths and join the index
// by frontmatter alone. Source hierarchy never dictates the invocation name.
const CORE_SOURCES = [
  'rig/tier-1/skills/grilling/SKILL.md',
  'rig/tier-1/skills/product-design/SKILL.md',
  'skills/rig/SKILL.md',
  'rig/tier-1/skills/execution/SKILL.md',
  'rig/tier-1/skills/tdd/SKILL.md',
  'rig/tier-1/skills/debugging/SKILL.md',
  'rig/tier-1/skills/code-review/SKILL.md',
  'rig/tier-1/skills/onboarding/SKILL.md',
];

const TAXONOMY_ID = 'skill-shelf-v1';
const CAPABILITY_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*\.[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TOOL_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const TAG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const MAX_GUARANTEE_CODE_POINTS = 160;

function fail(message) {
  throw new Error(`rig: invalid skill catalog — ${message}`);
}

function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

// Canonical JSON: object keys sorted recursively, arrays in declared order,
// no insignificant whitespace. Mirrors tests/helpers/path-b.js `canonical()`.
function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

function unquote(raw) {
  const text = raw.trim();
  if (text.length >= 2 && ((text.startsWith('"') && text.endsWith('"')) || (text.startsWith("'") && text.endsWith("'")))) {
    return text.slice(1, -1).replace(/\\"/g, '"');
  }
  return text;
}

// Bounded frontmatter reader. Supports exactly the shapes the skill sources
// use: `key: scalar`, `key: >`/`key: |` folded blocks, and `key:` followed by
// an indented `- item` block sequence. Anything else is returned as null so a
// caller that requires the key fails loudly. No YAML dependency.
function parseFrontmatter(body, label) {
  const match = body.match(/^---\n([\s\S]*?)\n---(?:\n|$)/);
  if (!match) fail(`${label} has no frontmatter block`);
  const lines = match[1].split('\n');
  const fields = {};
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || /^\s/.test(line) || line.startsWith('#')) continue;
    const key = line.match(/^([A-Za-z0-9_-]+):(.*)$/);
    if (!key) continue;
    const [, name, rest] = key;
    const inline = rest.trim();
    if (inline === '>' || inline === '|') {
      const parts = [];
      while (i + 1 < lines.length && (!lines[i + 1].trim() || /^\s/.test(lines[i + 1]))) {
        i += 1;
        parts.push(lines[i].trim());
      }
      fields[name] = inline === '>' ? parts.join(' ').trim() : parts.join('\n').trim();
    } else if (inline === '') {
      const items = [];
      let sequence = true;
      while (i + 1 < lines.length && (!lines[i + 1].trim() || /^\s/.test(lines[i + 1]))) {
        i += 1;
        const child = lines[i].trim();
        if (!child) continue;
        if (child.startsWith('- ')) items.push(unquote(child.slice(2)));
        else sequence = false;
      }
      fields[name] = sequence ? items : null;
    } else {
      fields[name] = unquote(inline);
    }
  }
  return fields;
}

function requireString(fields, key, label) {
  const value = fields[key];
  if (typeof value !== 'string' || !value) fail(`${label} is missing a "${key}" value`);
  return value;
}

function requireSequence(fields, key, label) {
  const value = fields[key];
  if (!Array.isArray(value) || value.length === 0) fail(`${label} is missing a non-empty "${key}" sequence`);
  return value;
}

function readFamilies() {
  const file = path.join(SKILL_ROOT, 'families.json');
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (value.schema_version !== 1) fail('families.json needs schema_version 1');
  const families = value.families;
  if (!Array.isArray(families) || families.length === 0) fail('families.json has no families');
  const ids = families.map((family) => family.id);
  if (new Set(ids).size !== ids.length) fail('families.json has duplicate family ids');
  if (ids.join(',') !== [...ids].sort().join(',')) fail('families.json families must be sorted by id');
  for (const family of families) {
    if (!family.id || !family.title || !family.description) fail(`families.json row "${family.id}" needs id, title, and description`);
  }
  return families.map(({ id, title, description }) => ({ id, title, description }));
}

function readMigrations() {
  const file = path.join(SKILL_ROOT, 'migrations.json');
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (value.schema_version !== 1) fail('migrations.json needs schema_version 1');
  const aliases = value.aliases;
  if (!aliases || typeof aliases !== 'object' || Array.isArray(aliases)) fail('migrations.json needs an aliases object');
  return aliases;
}

// Recursively find `<family>/<capability-leaf>/<source-dir>/SKILL.md`.
function findOptionalSources() {
  if (!fs.existsSync(SKILL_ROOT)) return [];
  const out = [];
  for (const family of fs.readdirSync(SKILL_ROOT, { withFileTypes: true })) {
    if (!family.isDirectory() || RESERVED.has(family.name)) continue;
    const familyDir = path.join(SKILL_ROOT, family.name);
    for (const leaf of fs.readdirSync(familyDir, { withFileTypes: true })) {
      if (!leaf.isDirectory()) continue;
      const leafDir = path.join(familyDir, leaf.name);
      for (const source of fs.readdirSync(leafDir, { withFileTypes: true })) {
        if (!source.isDirectory()) continue;
        const skillMd = path.join(leafDir, source.name, 'SKILL.md');
        if (!fs.existsSync(skillMd)) continue;
        out.push({
          dir: source.name,
          source_rel: `${SKILL_ROOT_REL}/${family.name}/${leaf.name}/${source.name}/SKILL.md`,
        });
      }
    }
  }
  return out.sort((a, b) => a.source_rel.localeCompare(b.source_rel));
}

function readSkill(sourceRel, dir, familyIds) {
  const body = fs.readFileSync(path.join(ROOT, sourceRel), 'utf8');
  const fields = parseFrontmatter(body, sourceRel);
  const name = requireString(fields, 'name', sourceRel);
  const description = requireString(fields, 'description', sourceRel);
  const family = requireString(fields, 'family', sourceRel);
  const tool = requireString(fields, 'tool', sourceRel);
  const capability = requireString(fields, 'capability', sourceRel);
  const guarantees = requireSequence(fields, 'guarantees', sourceRel);
  const overlapTags = requireSequence(fields, 'overlap_tags', sourceRel);

  if (!familyIds.has(family)) fail(`${sourceRel} declares unknown family "${family}"`);
  if (!TOOL_RE.test(tool)) fail(`${sourceRel} declares invalid tool "${tool}"`);
  if (!CAPABILITY_RE.test(capability)) fail(`${sourceRel} declares invalid capability "${capability}"`);
  if (capability.split('.')[0] !== family) fail(`${sourceRel} capability "${capability}" does not start with family "${family}"`);
  if (new Set(guarantees).size !== guarantees.length) fail(`${sourceRel} repeats a guarantee`);
  for (const claim of guarantees) {
    if (claim.includes('\n')) fail(`${sourceRel} has a multi-line guarantee`);
    if ([...claim].length > MAX_GUARANTEE_CODE_POINTS) fail(`${sourceRel} has a guarantee longer than ${MAX_GUARANTEE_CODE_POINTS} code points`);
  }
  for (const tag of overlapTags) {
    if (!TAG_RE.test(tag)) fail(`${sourceRel} declares invalid overlap tag "${tag}"`);
  }
  if (new Set(overlapTags).size !== overlapTags.length) fail(`${sourceRel} repeats an overlap tag`);
  if (overlapTags.join(',') !== [...overlapTags].sort().join(',')) fail(`${sourceRel} overlap_tags must be sorted`);

  return { name, dir, source_rel: sourceRel, family, tool, capability, guarantees, overlap_tags: overlapTags, description };
}

// The optional shelf, with the historical name-collision tie-break: a source
// whose directory matches its declared name keeps the canonical slot.
function loadOptionalSkills(familyIds = new Set(readFamilies().map(({ id }) => id))) {
  const entries = findOptionalSources().map(({ dir, source_rel: sourceRel }) => readSkill(sourceRel, dir, familyIds));
  entries.sort((a, b) => {
    const ma = a.dir === a.name ? 0 : 1;
    const mb = b.dir === b.name ? 0 : 1;
    return ma - mb || a.source_rel.localeCompare(b.source_rel);
  });
  const claimed = new Set();
  const skills = [];
  for (const entry of entries) {
    let name = entry.name;
    if (claimed.has(name)) name = entry.dir;
    if (claimed.has(name)) fail(`duplicate skill name "${entry.name}" at ${entry.source_rel}`);
    claimed.add(name);
    skills.push({ ...entry, name });
  }
  return skills;
}

function loadCoreSkills(familyIds) {
  return CORE_SOURCES.map((sourceRel) => readSkill(sourceRel, path.basename(path.dirname(sourceRel)), familyIds));
}

// Every row the digest covers, in exactly the projected key set.
function catalogRow(skill, aliasesByName, sourceKind) {
  return {
    id: skill.name,
    name: skill.name,
    description: skill.description,
    family: skill.family,
    tool: skill.tool,
    capability: skill.capability,
    guarantees: skill.guarantees,
    overlap_tags: skill.overlap_tags,
    aliases: aliasesByName.get(skill.name) || [],
    source_kind: sourceKind,
    required: sourceKind === 'core',
    source_rel: skill.source_rel,
  };
}

function buildSkillCatalog({ releaseTag = 'v5.0.0', softBudget } = {}) {
  const families = readFamilies();
  const familyIds = new Set(families.map(({ id }) => id));
  const aliases = readMigrations();
  const optional = loadOptionalSkills(familyIds);
  const core = loadCoreSkills(familyIds);

  const names = new Set([...optional, ...core].map(({ name }) => name));
  if (names.size !== optional.length + core.length) fail('two skills declare the same canonical name');

  const aliasesByName = new Map();
  for (const [legacy, canonicalName] of Object.entries(aliases)) {
    if (!names.has(canonicalName)) fail(`alias "${legacy}" targets unknown skill "${canonicalName}"`);
    if (names.has(legacy)) fail(`alias "${legacy}" collides with a canonical skill name`);
    const list = aliasesByName.get(canonicalName) || [];
    list.push(legacy);
    aliasesByName.set(canonicalName, list);
  }
  for (const list of aliasesByName.values()) list.sort();

  const skills = [
    ...core.map((skill) => catalogRow(skill, aliasesByName, 'core')),
    ...optional.map((skill) => catalogRow(skill, aliasesByName, 'optional')),
  ].sort((a, b) => a.family.localeCompare(b.family)
    || a.capability.localeCompare(b.capability)
    || a.id.localeCompare(b.id));

  return {
    schema_version: 1,
    catalog_kind: 'skill-shelf',
    release: { version: releaseTag, skills_digest: sha256(canonical(skills)) },
    taxonomy: { id: TAXONOMY_ID, families },
    skills,
    soft_budget: softBudget || { basis: 'previous-release', files: 0, bytes: 0 },
  };
}

// Validate an already-generated catalogue object (the installed `.rig/catalog.json`
// copy) without re-reading the source shelf. Throws on the first problem.
function validateSkillCatalog(catalog) {
  if (!catalog || typeof catalog !== 'object') fail('catalog is not an object');
  if (catalog.schema_version !== 1) fail('catalog needs schema_version 1');
  if (catalog.catalog_kind !== 'skill-shelf') fail('catalog_kind must be "skill-shelf"');
  if (!catalog.taxonomy || !Array.isArray(catalog.taxonomy.families)) fail('catalog has no taxonomy families');
  if (!Array.isArray(catalog.skills) || catalog.skills.length === 0) fail('catalog has no skills');
  const familyIds = new Set(catalog.taxonomy.families.map(({ id }) => id));
  const names = new Set(catalog.skills.map(({ name }) => name));
  for (const skill of catalog.skills) {
    const label = `catalog skill "${skill && skill.id}"`;
    if (!skill || typeof skill.id !== 'string' || !skill.id) fail('a catalog skill has no id');
    if (typeof skill.name !== 'string' || !skill.name) fail(`${label} has no name`);
    if (typeof skill.description !== 'string' || !skill.description) fail(`${label} has no description`);
    if (!familyIds.has(skill.family)) fail(`${label} declares unknown family "${skill.family}"`);
    if (typeof skill.tool !== 'string' || !TOOL_RE.test(skill.tool)) fail(`${label} has an invalid tool`);
    if (typeof skill.capability !== 'string' || !CAPABILITY_RE.test(skill.capability)) fail(`${label} has an invalid capability`);
    if (skill.capability.split('.')[0] !== skill.family) fail(`${label} capability does not match its family`);
    if (!Array.isArray(skill.guarantees) || skill.guarantees.length === 0) fail(`${label} has no guarantees`);
    for (const claim of skill.guarantees) {
      if (typeof claim !== 'string' || claim.includes('\n') || [...claim].length > MAX_GUARANTEE_CODE_POINTS) {
        fail(`${label} has an invalid guarantee`);
      }
    }
    if (!Array.isArray(skill.overlap_tags)) fail(`${label} has no overlap_tags`);
    for (const tag of skill.overlap_tags) {
      if (typeof tag !== 'string' || !TAG_RE.test(tag)) fail(`${label} has an invalid overlap tag`);
    }
    if (!Array.isArray(skill.aliases)) fail(`${label} has no aliases list`);
    for (const alias of skill.aliases) {
      if (typeof alias !== 'string' || names.has(alias)) fail(`${label} declares an invalid alias "${alias}"`);
      if (!TAG_RE.test(alias)) fail(`${label} declares an invalid alias "${alias}"`);
    }
    if (skill.source_kind !== 'core' && skill.source_kind !== 'optional') fail(`${label} has an invalid source_kind`);
    if (typeof skill.required !== 'boolean') fail(`${label} has an invalid required flag`);
    if (typeof skill.source_rel !== 'string' || !skill.source_rel) fail(`${label} has no source_rel`);
  }
  return catalog;
}

// The digest a proposal is bound to: recompute it from the rows so a tampered
// `release.skills_digest` is caught rather than trusted.
function skillsDigest(catalog) {
  const rows = catalog.skills.map(({
    id, name, description, family, tool, capability, guarantees, overlap_tags: overlapTags, aliases, source_kind: sourceKind, required, source_rel: sourceRel,
  }) => ({
    id, name, description, family, tool, capability, guarantees, overlap_tags: overlapTags, aliases, source_kind: sourceKind, required, source_rel: sourceRel,
  }));
  return sha256(canonical(rows));
}

module.exports = {
  CORE_SOURCES,
  SKILL_ROOT,
  SKILL_ROOT_REL,
  buildSkillCatalog,
  canonical,
  loadOptionalSkills,
  parseFrontmatter,
  sha256,
  skillsDigest,
  validateSkillCatalog,
};
