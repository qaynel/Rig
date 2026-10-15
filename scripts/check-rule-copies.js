#!/usr/bin/env node
'use strict';

// One authoring authority (subplan 03 Contract). This gate keeps its historical
// name because `npm test` pins it, but it no longer compares hand-kept copies:
//   1. the projection is reproducible: every generated host file in this
//      repository (native skill directories, workflows, the six host rule files,
//      AGENTS.md after its pointer line) equals what project() yields from
//      rig/corpus/ — regenerate with `node scripts/project-repo.js`;
//   2. no twin: no file under rig/corpus/ is byte-identical to a file elsewhere
//      in the repository, other than those generated host projections;
//   3. the load-bearing rule phrases survive in the implementation skill and in
//      the canonical repository instructions.

const fs = require('node:fs');
const crypto = require('node:crypto');
const path = require('node:path');
const { generatedFiles } = require('./project-repo');

const root = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['node_modules', '.git', '.venv', '.context']);
// History and fixtures quote corpus bytes on purpose; they are provenance, not authorities.
const PROVENANCE = (file) => file.startsWith('wiki/') || file.startsWith('docs/superpowers/') || file.startsWith('tests/fixtures/');
const MIN_TWIN_BYTES = 64;

const INVARIANTS = [
  'naive heuristic', 'ONE runnable check', 'flimsier algorithm', 'input validation at trust boundaries',
  'prevents data loss', 'security', 'accessibility', 'Lazy code without its check is unfinished',
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile()) out.push(abs);
  }
  return out;
}

const digestOf = (bytes) => crypto.createHash('sha256').update(bytes).digest('hex');
const relOf = (abs) => path.relative(root, abs).split(path.sep).join('/');

function main() {
  const problems = [];

  const generated = generatedFiles(root);
  for (const [rel, bytes] of generated) {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs) || !fs.readFileSync(abs).equals(bytes)) problems.push(`${rel} is not what the corpus projects (run: node scripts/project-repo.js)`);
  }

  const bySize = new Map();
  for (const abs of walk(root)) {
    const rel = relOf(abs);
    if (rel.startsWith('rig/corpus/') || PROVENANCE(rel)) continue;
    const size = fs.statSync(abs).size;
    if (size >= MIN_TWIN_BYTES) (bySize.get(size) || bySize.set(size, []).get(size)).push(rel);
  }
  for (const abs of walk(path.join(root, 'rig/corpus'))) {
    const size = fs.statSync(abs).size;
    const candidates = bySize.get(size);
    if (!candidates) continue;
    const digest = digestOf(fs.readFileSync(abs));
    for (const other of candidates) {
      if (generated.has(other)) continue;
      if (digestOf(fs.readFileSync(path.join(root, other))) === digest) problems.push(`${relOf(abs)} is duplicated at ${other} (a corpus file has exactly one home)`);
    }
  }

  // The two MCP entrypoints are byte-identical by design (I-C-4). The frozen
  // oracle pins that only for index.js, so instructions.js would drift unseen.
  // shortcut: partial trees (this gate's own fixtures copy rig/ without rig-mcp/)
  // are skipped rather than reported; drop the guard if the pair ever moves.
  const pair = ['rig-mcp/instructions.js', 'rig/mcp-runtime/instructions.js'].map((rel) => path.join(root, rel));
  if (pair.every((file) => fs.existsSync(file))) {
    const [mcp, runtime] = pair.map((file) => digestOf(fs.readFileSync(file)));
    if (mcp !== runtime) problems.push('rig-mcp/instructions.js and rig/mcp-runtime/instructions.js must be byte-identical; edit both in one commit');
  }

  const skill = fs.readFileSync(path.join(root, 'skills/rig/SKILL.md'), 'utf8');
  const instructions = fs.readFileSync(path.join(root, 'rig/corpus/rules/repo-instructions.md'), 'utf8');
  for (const phrase of INVARIANTS) {
    for (const [label, text] of [['skills/rig/SKILL.md', skill], ['rig/corpus/rules/repo-instructions.md', instructions]]) {
      if (!text.includes(phrase)) problems.push(`${label} is missing rule invariant: "${phrase}"`);
    }
  }

  if (problems.length) {
    console.error(problems.join('\n'));
    process.exit(1);
  }
  console.log(`The projection is reproducible (${generated.size} generated files); no corpus file has a twin; ${INVARIANTS.length} rule invariants present.`);
}

main();
