// The one projection seam: project(corpus, host, selection) -> [{ path, bytes, ... }].
//
// Pure. It reads only the in-memory `corpus` snapshot it is handed (see
// rig/lib/corpus.js for the loader that is allowed to touch the disk) and never
// touches the file system, the network, or a clock. Both install paths (the
// bootstrap payload and adaptive onboarding) call it, and so does
// `node scripts/project-repo.js`; there is no second place that decides what a
// host receives. Hosts the corpus has no projector for are handled by the
// agent following rig/corpus/onboarding/unpack.md, never by Rig inferring.
//
// Entry shapes (`op` defaults to 'write'):
//   { path, bytes, mode }                           write the file
//   { op: 'seed_user_file', path, bytes, mode }     write only if absent; user owns it
//   { op: 'pinned_catalog', path, bytes, mode }     write; a hand-edited copy conflicts
//   { op: 'ensure_line', path, line, bytes }        append one line if missing
//   { op: 'ensure_gitignore_block', path, lines }   append the managed ignore block
'use strict';

const path = require('node:path');
const { INSTRUCTION_ONLY_HOSTS } = require('./host-capabilities');

const NEUTRAL = 'neutral';
// Hosts that have a shipped projector in rig/corpus/projections/<host>.js.
const PROJECTOR_HOSTS = [
  'claude', 'codex', 'antigravity', 'cursor', 'windsurf', 'cline', 'kiro', 'gemini', 'copilot', 'codewhale',
];

function fail(message) {
  throw new Error(`rig: ${message}`);
}

// Build inputs and working notes never ship: the rendered SKILL.md is the
// product; .tmpl is its source; TODOS-format.md is a dev file.
function isLitter(rel) {
  return rel.endsWith('.tmpl') || path.posix.basename(rel) === 'TODOS-format.md';
}

function skipsNodeModules(rel) {
  return rel.split('/').includes('node_modules');
}

function normalizeSelection(selection = {}) {
  const hosts = [...new Set(selection.hosts || [])];
  return { hosts, delivery: selection.delivery === 'active' ? 'active' : 'default' };
}

function selectionFlags(selection) {
  const sel = normalizeSelection(selection);
  return {
    ...sel,
    active: sel.delivery === 'active',
    instructionOnly: sel.hosts.some((host) => INSTRUCTION_ONLY_HOSTS.has(host)),
  };
}

// Same gate vocabulary the v5 manifest used.
function gateOpen(gate, flags) {
  if (!gate) return true;
  if (gate === 'instruction_only_selected') return flags.instructionOnly;
  if (gate === 'active_delivery') return flags.active;
  if (gate === 'default_delivery') return !flags.active;
  if (gate === 'suppress_on_instruction_only_adaptive') return !(flags.instructionOnly && flags.active);
  return fail(`unknown payload gate "${gate}"`);
}

function hostMatches(rowHost, host) {
  const hosts = Array.isArray(rowHost) ? rowHost : [rowHost];
  return hosts.includes(host);
}

// ---------------------------------------------------------------------------
// Corpus accessors (pure lookups on the snapshot)
// ---------------------------------------------------------------------------

function read(corpus, rel) {
  const file = corpus.files.get(rel);
  if (!file) fail(`corpus is missing ${rel}`);
  return file;
}

function treeFiles(corpus, rel, { markdownOnly = false } = {}) {
  const prefix = rel.endsWith('/') ? rel : `${rel}/`;
  return [...corpus.files.keys()]
    .filter((key) => key.startsWith(prefix) && !isLitter(key) && !skipsNodeModules(key.slice(prefix.length))
      && (!markdownOnly || key.endsWith('.md')))
    .sort();
}

function copyEntry(corpus, from, to) {
  const { bytes, mode } = read(corpus, from);
  return { path: to, bytes, mode };
}

function copyTreeEntries(corpus, from, to, options) {
  return treeFiles(corpus, from, options).map((key) => {
    const { bytes, mode } = read(corpus, key);
    return { path: `${to}/${key.slice(from.length + 1)}`, bytes, mode };
  });
}

// ---------------------------------------------------------------------------
// Skill naming and projection (shared with adaptive onboarding)
// ---------------------------------------------------------------------------

// Rewrite the frontmatter `name:` line so a skill installed under
// `rig-<name>/` also identifies itself as `rig-<name>` — native hosts discover
// skills by that frontmatter field and it must match the directory. Bounded to
// the first `name:` line inside the leading `---` block.
function rewriteSkillName(body, prefix, declared) {
  return body.replace(
    /^(---\n(?:(?!---\n)[^\n]*\n)*?name:\s*)[^\n]+/m,
    (_m, head) => `${head}${prefix}${declared}`,
  );
}

// Native skill-discovery scopes Rig writes to directly, and the one shared
// instruction-only scope. One table; payload and onboarding both read it.
const NATIVE_SKILL_SCOPES = {
  claude: { host_scope: 'claude', root: '.claude/skills' },
  codex: { host_scope: 'codex', root: '.agents/skills' },
};
const INSTRUCTION_ONLY_SCOPE = { host_scope: 'instruction-only', root: '.rig/skills' };

// The canonical, scope-independent identity of a skill: 'rig' stays 'rig' (it
// names itself, not a namespace); every other name loses a leading "rig-".
function canonicalSkillName(name) {
  if (name === 'rig') return 'rig';
  return name.startsWith('rig-') ? name.slice('rig-'.length) : name;
}

// Naming is scope-specific: native layouts project as `rig-<name>`; the
// instruction-only layout projects unprefixed.
function scopedSkillName(canonicalName, scope) {
  if (canonicalName === 'rig') return 'rig';
  return scope.host_scope === 'instruction-only' ? canonicalName : `rig-${canonicalName}`;
}

// One skill directory projected into `dir`. `files` are { rel, bytes, mode }
// relative to the skill directory; SKILL.md has its frontmatter name aligned
// with the installed directory (`prefix` + `declaredName`).
function projectSkillFiles({ files, dir, declaredName, prefix = '' }) {
  return files.map(({ rel, bytes, mode }) => {
    const out = rel === 'SKILL.md'
      ? Buffer.from(rewriteSkillName(bytes.toString('utf8'), prefix, declaredName))
      : bytes;
    return { path: `${dir}/${rel}`, bytes: out, mode };
  });
}

// ---------------------------------------------------------------------------
// Helpers handed to host projectors
// ---------------------------------------------------------------------------

function projectionHelpers(corpus, flags) {
  const pointer = read(corpus, corpus.descriptor.adapters.pointer).bytes.toString('utf8').trim();
  return {
    flags,
    pointerLine: pointer,
    skillNames: corpus.descriptor.skill_order,
    skillSource(name) {
      const rel = corpus.descriptor.skills[name];
      if (!rel) fail(`corpus has no skill "${name}"`);
      return read(corpus, rel);
    },
    copy: (from, to) => copyEntry(corpus, from, to),
    adapter(name, to) {
      return copyEntry(corpus, corpus.descriptor.adapters[name], to);
    },
    nativeSkills(root) {
      return this.skillNames.map((name) => {
        const { bytes, mode } = this.skillSource(name);
        return { path: `${root}/rig-${name}/SKILL.md`, bytes, mode };
      });
    },
    workflows() {
      return corpus.descriptor.workflows.map((name) => copyEntry(corpus, `rig/corpus/workflows/${name}.md`, `.agents/workflows/${name}.md`));
    },
    ensureLine(to) {
      return { op: 'ensure_line', path: to, line: pointer, bytes: Buffer.from(`${pointer}\n`) };
    },
  };
}

// ---------------------------------------------------------------------------
// Neutral layer: the rows of rig/manifest.json that every install receives
// ---------------------------------------------------------------------------

function neutralEntries(corpus, flags) {
  const entries = [];
  for (const row of corpus.manifest.payload) {
    if (!hostMatches(row.host, NEUTRAL)) continue;
    if (!gateOpen(row.gate, flags)) continue;
    if (row.op === 'copy') {
      const entry = copyEntry(corpus, row.from, row.to);
      if (row.rewrite_skill_name) {
        entry.bytes = Buffer.from(rewriteSkillName(entry.bytes.toString('utf8'), '', row.rewrite_skill_name));
      }
      entries.push(entry);
    }
    else if (row.op === 'seed_user_file') entries.push({ ...copyEntry(corpus, row.from, row.to), op: 'seed_user_file' });
    else if (row.op === 'copy_tree') entries.push(...copyTreeEntries(corpus, row.from, row.to));
    else if (row.op === 'install_pinned_catalog') entries.push({ ...copyEntry(corpus, row.from, row.to), mode: 0o644, op: 'pinned_catalog' });
    else if (row.op === 'ensure_line') {
      entries.push({ op: 'ensure_line', path: row.to, line: row.line, bytes: Buffer.from(`${row.line}\n`) });
    } else if (row.op === 'ensure_gitignore_block') {
      entries.push({ op: 'ensure_gitignore_block', path: '.gitignore', lines: [...row.lines], bytes: Buffer.from(`${row.lines.join('\n')}\n`) });
    } else fail(`unknown payload op "${row.op}"`);
  }
  return entries;
}

// ---------------------------------------------------------------------------
// project()
// ---------------------------------------------------------------------------

let projectorCache = null;
function projectors() {
  // Required lazily: the installed runtime copies rig/lib but not the corpus
  // projectors, and only the install path needs them.
  if (!projectorCache) {
    projectorCache = new Map(PROJECTOR_HOSTS.map((host) => [host, require(`../corpus/projections/${host}.js`)]));
  }
  return projectorCache;
}

function project(corpus, host, selection) {
  const flags = selectionFlags(selection);
  if (host === NEUTRAL) return neutralEntries(corpus, flags);
  const projector = projectors().get(host);
  if (!projector) return []; // hosts that read the neutral .rig/ layer need nothing of their own
  return projector.project(projectionHelpers(corpus, flags));
}

function sameBytes(a, b) {
  return a.op === b.op && a.path === b.path && Buffer.compare(a.bytes, b.bytes) === 0
    && String(a.line) === String(b.line) && JSON.stringify(a.lines) === JSON.stringify(b.lines);
}

// Neutral layer first, then each selected host in order. Entries two layers
// both emit (hosts that share one file) collapse to one; a disagreement between
// them is a corpus bug, not something to pick a winner for.
function projectAll(corpus, selection) {
  const sel = normalizeSelection(selection);
  const seen = new Map();
  const out = [];
  for (const host of [NEUTRAL, ...sel.hosts]) {
    for (const entry of project(corpus, host, sel)) {
      const key = entry.op === 'ensure_line' ? `${entry.path}\0${entry.line}` : entry.path;
      const prior = seen.get(key);
      if (prior) {
        if (!sameBytes(prior, entry)) fail(`two projections disagree about ${entry.path}`);
        continue;
      }
      seen.set(key, entry);
      out.push(entry);
    }
  }
  return out;
}

function hasProjector(host) {
  return PROJECTOR_HOSTS.includes(host);
}

module.exports = {
  NEUTRAL, PROJECTOR_HOSTS, NATIVE_SKILL_SCOPES, INSTRUCTION_ONLY_SCOPE,
  project, projectAll, hasProjector, selectionFlags, gateOpen, isLitter,
  rewriteSkillName, canonicalSkillName, scopedSkillName, projectSkillFiles,
};
