'use strict';

const fs = require('node:fs');
const path = require('node:path');

const SKILL_ROOT = path.join(__dirname, '..', 'catalog', 'skills');
const RESERVED = new Set(['LICENSE.upstream', 'UPSTREAM.md', 'README.md']);

// Return the skill's declared name from SKILL.md frontmatter — that is the
// name the agent invokes it by. Falls back to the directory name only if the
// frontmatter omits `name:` (should not happen for shipping skills).
function readDeclaredName(dirName) {
  const md = path.join(SKILL_ROOT, dirName, 'SKILL.md');
  if (!fs.existsSync(md)) return null;
  const body = fs.readFileSync(md, 'utf8');
  const fm = body.match(/^---\n([\s\S]*?)\n---/);
  if (!fm) return dirName;
  const line = fm[1].split('\n').find((l) => /^name:\s*/.test(l));
  if (!line) return dirName;
  return line.replace(/^name:\s*/, '').trim() || dirName;
}

function listVendoredSkills() {
  if (!fs.existsSync(SKILL_ROOT)) return [];
  const dirs = fs.readdirSync(SKILL_ROOT, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !RESERVED.has(e.name))
    .map((e) => ({ dir: e.name, declared: readDeclaredName(e.name) }))
    .filter((e) => e.declared);
  // When two directories declare the same frontmatter name, the entry whose
  // directory matches its declared name wins the canonical slot; the other
  // uses its directory name so every shipped skill stays uniquely addressable.
  dirs.sort((a, b) => {
    const ma = a.dir === a.declared ? 0 : 1;
    const mb = b.dir === b.declared ? 0 : 1;
    return ma - mb;
  });
  const claimed = new Set();
  const skills = [];
  for (const entry of dirs) {
    let name = entry.declared;
    if (claimed.has(name)) name = entry.dir;
    if (claimed.has(name)) continue;
    claimed.add(name);
    skills.push({ name, dir: entry.dir });
  }
  return skills;
}

module.exports = { listVendoredSkills };
