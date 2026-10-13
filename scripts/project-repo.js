#!/usr/bin/env node
// Regenerate this repository's own projections from the one Rig corpus
// (rig/corpus/) through the same project() the installer uses.
//
//   node scripts/project-repo.js           write the generated files
//   node scripts/project-repo.js --check   fail if any generated file is stale
//
// Generated: native skill directories for Claude and Codex discovery,
// Antigravity workflows, and the repository-instruction copies host agents read
// in this checkout. Nothing here is authored by hand; edit the corpus.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { loadCorpus } = require('../rig/lib/corpus');
const { project } = require('../rig/lib/project');

const ROOT = path.join(__dirname, '..');
const GENERATED_SKILL_ROOTS = ['.claude/skills/rig-', '.agents/skills/rig-', '.agents/workflows/'];

function generatedFiles(root = ROOT) {
  const selection = { delivery: 'active', hosts: ['claude', 'codex', 'antigravity'] };
  const corpus = loadCorpus(selection, root);
  const files = new Map();
  for (const host of selection.hosts) {
    for (const entry of project(corpus, host, selection)) {
      if (entry.op || !GENERATED_SKILL_ROOTS.some((prefix) => entry.path.startsWith(prefix))) continue;
      files.set(entry.path, entry.bytes);
    }
  }
  const body = corpus.files.get('rig/corpus/rules/repo-instructions.md').bytes;
  const { copies } = JSON.parse(corpus.files.get('rig/corpus/rules/repo-copies.json').bytes.toString('utf8'));
  for (const [rel, frontmatter] of Object.entries(copies)) {
    files.set(rel, Buffer.concat([Buffer.from(frontmatter), body]));
  }
  return files;
}

function main(argv) {
  const check = argv.includes('--check');
  const files = generatedFiles();
  const stale = [];
  for (const [rel, bytes] of files) {
    const abs = path.join(ROOT, rel);
    const current = fs.existsSync(abs) ? fs.readFileSync(abs) : null;
    if (current && current.equals(bytes)) continue;
    stale.push(rel);
    if (!check) {
      fs.mkdirSync(path.dirname(abs), { recursive: true });
      fs.writeFileSync(abs, bytes);
    }
  }
  if (check && stale.length) {
    console.error(`Generated files are stale (run: node scripts/project-repo.js):\n  ${stale.join('\n  ')}`);
    return 1;
  }
  console.log(`${check ? 'Projection reproducible' : 'Projected'}: ${files.size} generated files${stale.length && !check ? `, ${stale.length} rewritten` : ''}.`);
  return 0;
}

if (require.main === module) process.exit(main(process.argv.slice(2)));

module.exports = { generatedFiles, GENERATED_SKILL_ROOTS };
