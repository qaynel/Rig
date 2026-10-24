'use strict';

// Agent-driven adaptive onboarding. propose() inspects the repository as it is
// and returns the smallest change set, digest-bound. apply() writes only the
// exact approved proposal, confined to <repo>/.rig/. discoverServices() reports
// host hooks and tools honestly: an unavailable integration is never "complete".

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const signoff = require('./user-signoff');

const INSTRUCTION_FILES = [
  ['CLAUDE.md', 'instructions'],
  ['AGENTS.md', 'instructions'],
  ['CONTRIBUTING.md', 'contributing'],
  ['README.md', 'contributing'],
  ['docs/CONTRIBUTING.md', 'contributing'],
];
const SKILL_ROOTS = ['.claude/skills', '.agents/skills'];
const CAPABILITIES = [{ capability: 'code-review', pattern: /review/ }];
const ADAPTATION = '.rig/adaptation.json';
const HOST_STATE = '.rig/host-capabilities.json';
const NOTHING = 'empty repository: nothing observed';
const TOOL_REMEDY = new Map([['ripgrep', 'install ripgrep (for example: brew install ripgrep) and re-run onboarding']]);

function canonical(v) {
  if (Array.isArray(v)) return `[${v.map(canonical).join(',')}]`;
  if (v && typeof v === 'object') {
    return `{${Object.keys(v).sort().map((k) => `${JSON.stringify(k)}:${canonical(v[k])}`).join(',')}}`;
  }
  return JSON.stringify(v);
}

function digestOf({ observations, changes, overlaps }) {
  return crypto.createHash('sha256').update(canonical({ observations, changes, overlaps })).digest('hex');
}

// True when p is base itself or lies beneath it (no '..' escape, not absolute).
function within(base, p) {
  const rel = path.relative(base, p);
  return !path.isAbsolute(rel) && rel.split(path.sep)[0] !== '..';
}

function exists(p) {
  try { fs.lstatSync(p); return true; } catch { return false; }
}

// Contents of a repo-relative file, or null when missing or resolving outside the repo.
function readInside(root, rel) {
  let real;
  try { real = fs.realpathSync(path.join(root, rel)); } catch { return null; }
  if (!within(root, real) || !fs.statSync(real).isFile()) return null;
  return fs.readFileSync(real, 'utf8');
}

// Frontmatter `name:` plus the first non-empty body line, trimmed to 120 characters.
function summarize(text) {
  const lines = text.split(/\r?\n/);
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === '---');
  const hasFrontmatter = lines[0].trim() === '---' && end > 0;
  const nameLine = hasFrontmatter ? lines.slice(1, end).find((l) => /^name:/.test(l)) : undefined;
  const name = nameLine ? nameLine.replace(/^name:\s*/, '').trim().replace(/^(['"])(.*)\1$/, '$2') : null;
  const body = hasFrontmatter ? lines.slice(end + 1) : lines;
  const summary = (body.map((l) => l.trim()).find(Boolean) || '').slice(0, 120);
  return { name, summary };
}

function observe(root) {
  const observations = [];
  const skills = [];
  for (const [rel, kind] of INSTRUCTION_FILES) {
    const text = readInside(root, rel);
    if (text !== null) observations.push({ source: rel, kind, summary: summarize(text).summary });
  }
  for (const skillRoot of SKILL_ROOTS) {
    let dirs = [];
    try { dirs = fs.readdirSync(path.join(root, skillRoot)).sort(); } catch { dirs = []; }
    for (const dir of dirs) {
      const source = `${skillRoot}/${dir}/SKILL.md`;
      const text = readInside(root, source);
      if (text === null) continue;
      const { name, summary } = summarize(text);
      observations.push({ source, kind: 'skill', summary });
      skills.push({ source, dir, name });
    }
  }
  return { observations, skills };
}

function capabilityOf(skill) {
  const hit = CAPABILITIES.find((c) => c.pattern.test(skill.dir) || (skill.name && c.pattern.test(skill.name)));
  return hit ? hit.capability : null;
}

function propose(repo) {
  const root = fs.realpathSync(repo);
  const { observations, skills } = observe(root);
  // The repository's own skill stays the owner; Rig adds no duplicate.
  const overlaps = [];
  for (const skill of skills) {
    const capability = capabilityOf(skill);
    if (!capability || overlaps.some((o) => o.capability === capability)) continue;
    overlaps.push({
      capability,
      existing_source: skill.source,
      rig_source: `.rig/skills/${capability}/SKILL.md`,
      resolution: 'reuse-existing',
    });
  }
  const sources = observations.map((o) => o.source);
  const changes = [{ path: ADAPTATION, because: sources.length ? sources : NOTHING }];
  return {
    observations, changes, overlaps, digest: digestOf({ observations, changes, overlaps }),
    signoff: signoff.interview(repo),
  };
}

// Refuse a path whose nearest existing ancestor resolves outside <repo>/.rig (symlink escape).
function confine(root, abs) {
  const rig = path.join(root, '.rig');
  let probe = abs;
  while (!exists(probe)) {
    if (probe === rig) return; // not created yet: nothing to escape through
    probe = path.dirname(probe);
  }
  let ok = false;
  try { ok = within(rig, fs.realpathSync(probe)); } catch { ok = false; }
  if (!ok) throw new Error(`change path escapes .rig/ through a symlink: ${abs}; nothing was written`);
}

function target(root, p) {
  const rig = path.join(root, '.rig');
  const abs = path.resolve(root, typeof p === 'string' ? p : '');
  const bad = typeof p !== 'string' || !p || p.includes('..') || path.isAbsolute(p) || path.win32.isAbsolute(p);
  if (bad || abs === rig || !within(rig, abs)) {
    throw new Error(`refusing change path ${JSON.stringify(p)}: must be relative and inside .rig/; nothing was written`);
  }
  confine(root, abs);
  return abs;
}

function put(root, abs, text) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text);
  return path.relative(root, abs).split(path.sep).join('/');
}

function apply(repo, proposal, opts = {}) {
  const { observations, changes, overlaps } = proposal || {};
  if (!Array.isArray(observations) || !Array.isArray(changes) || !Array.isArray(overlaps)) {
    throw new Error('proposal is malformed; nothing was written');
  }
  const approved = opts.approved_digest;
  if (!approved || digestOf({ observations, changes, overlaps }) !== approved || proposal.digest !== approved) {
    throw new Error('proposal changed since the approved digest; nothing was written');
  }
  const root = fs.realpathSync(repo);
  // Validate every path before the first byte lands.
  const adaptationAbs = target(root, ADAPTATION);
  const contentWrites = changes
    .map((c) => ({ abs: target(root, c.path), content: c.content }))
    .filter((w) => w.abs !== adaptationAbs && typeof w.content === 'string');

  const owners = [];
  for (const o of overlaps) {
    if (!owners.some((w) => w.capability === o.capability)) {
      owners.push({ capability: o.capability, source: o.existing_source || o.rig_source });
    }
  }
  const adaptation = { digest: proposal.digest, applied_at: new Date().toISOString(), observations, overlaps, owners, changes };
  const applied = [put(root, adaptationAbs, `${JSON.stringify(adaptation, null, 2)}\n`)];
  for (const w of contentWrites) applied.push(put(root, w.abs, w.content));
  return { applied };
}

function capabilityOwners(repo) {
  const text = readInside(fs.realpathSync(repo), ADAPTATION);
  return text === null ? [] : JSON.parse(text).owners || [];
}

function hookEntry(name, state) {
  const base = { name, kind: 'hook' };
  switch (state) {
    case 'unsupported':
      return { ...base, available: false, status: 'unsupported', remedy: `the host agent has no "${name}" hook surface, so Rig cannot install one; run the same check manually before committing or in CI` };
    case 'supported':
    case 'available':
      return { ...base, available: true, status: 'available-not-integrated', remedy: `the host supports a "${name}" hook that Rig does not install; add a "${name}" entry to the host hook configuration that runs the check, then re-run onboarding` };
    case 'emitted':
      return { ...base, available: true, status: 'emitted', remedy: '' };
    default:
      return { ...base, available: false, status: 'gap', remedy: `hook state ${JSON.stringify(state)} is not recognised; set "${name}" to supported, unsupported or emitted and re-run onboarding` };
  }
}

function toolEntry(name, state) {
  const base = { name, kind: 'tool' };
  if (state === 'present') return { ...base, available: true, status: 'ready', remedy: '' };
  return { ...base, available: false, status: 'gap', remedy: TOOL_REMEDY.get(name) || `install ${name} and re-run onboarding` };
}

function discoverServices(repo) {
  const text = readInside(fs.realpathSync(repo), HOST_STATE);
  const state = text === null ? {} : JSON.parse(text);
  const hooks = state.hooks || {};
  const tools = state.tools || {};
  return {
    services: [
      ...Object.keys(hooks).sort().map((name) => hookEntry(name, hooks[name])),
      ...Object.keys(tools).sort().map((name) => toolEntry(name, tools[name])),
    ],
  };
}

module.exports = { propose, apply, capabilityOwners, discoverServices };
