// Corpus loader: the only place that reads the corpus from disk. It builds the
// immutable in-memory snapshot that the pure project() function consumes.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { gateOpen, selectionFlags, isLitter, NEUTRAL } = require('./project');

const ROOT = path.join(__dirname, '..', '..');
const CORPUS_REL = 'rig/corpus';

function relOf(root, abs) {
  return path.relative(root, abs).split(path.sep).join('/');
}

// Read the snapshot a selection needs. `selection` is the same object project()
// receives, so gates evaluate identically at load and at projection time.
function loadCorpus(selection = {}, root = ROOT) {
  const flags = selectionFlags(selection);
  const files = new Map();

  const addFile = (rel) => {
    if (files.has(rel)) return;
    const abs = path.join(root, rel);
    files.set(rel, { bytes: fs.readFileSync(abs), mode: fs.statSync(abs).mode & 0o777 });
  };
  const addTree = (rel, keep = () => true) => {
    const abs = path.join(root, rel);
    if (!fs.existsSync(abs)) return;
    const walk = (dir) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.name === 'node_modules') continue;
        const child = path.join(dir, entry.name);
        // The shelf links one executable to another (rig-brain-reader), and
        // the v5 installer copied the link's target bytes; keep doing that.
        const stat = fs.statSync(child);
        if (stat.isDirectory()) walk(child);
        else if (stat.isFile()) {
          const childRel = relOf(root, child);
          if (!isLitter(childRel) && keep(childRel)) addFile(childRel);
        }
      }
    };
    walk(abs);
  };

  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'rig', 'manifest.json'), 'utf8'));
  const descriptor = JSON.parse(fs.readFileSync(path.join(root, CORPUS_REL, 'corpus.json'), 'utf8'));
  addTree(CORPUS_REL);
  for (const rel of Object.values(descriptor.skills)) addFile(rel);
  // Host projectors copy the provenance notices next to the vendored skills.
  for (const name of ['LICENSE.upstream', 'UPSTREAM.md']) addFile(`rig/catalog/skills/${name}`);

  for (const row of manifest.payload) {
    const hosts = Array.isArray(row.host) ? row.host : [row.host];
    if (!hosts.includes(NEUTRAL) || !gateOpen(row.gate, flags)) continue;
    if (['copy', 'seed_user_file', 'install_pinned_catalog'].includes(row.op)) addFile(row.from);
    else if (row.op === 'copy_tree') addTree(row.from);
  }

  return { root, files, manifest, descriptor };
}

module.exports = { ROOT, CORPUS_REL, loadCorpus };
