#!/usr/bin/env node
'use strict';

// Knowledge closeout and owner-decision filing. A change to a documented surface
// must not leave a user-facing page describing it stale, and owner wording is
// filed verbatim as a new record (never rewritten) and indexed by topic.
//
// shortcut: staleness is a path, basename or name-stem match, not semantic overlap; upgrade when false positives block real closeouts.

const fs = require('fs');
const path = require('path');

const SKIP = new Set(['.git', 'node_modules', '.rig']);
const normal = (file) => path.posix.normalize(file.replace(/\\/g, '/'));
const isDoc = (file) => file.endsWith('.md');
const stem = (file) => path.basename(file, path.extname(file)).toLowerCase().replace(/[^a-z]/g, '');
const cap = (word) => word.charAt(0).toUpperCase() + word.slice(1);

function walkMarkdown(repo, dir = repo, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(entry.name)) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walkMarkdown(repo, abs, out);
    else if (entry.isFile() && isDoc(entry.name)) out.push(normal(path.relative(repo, abs)));
  }
  return out;
}

// User-facing pages: docs/ and wiki/ (not the reasoning traces), plus root README and CHANGELOG.
function userFacing(file) {
  if (/^(docs|wiki)\//.test(file)) return !file.startsWith('wiki/reasoning/');
  return !file.includes('/') && /^(README|CHANGELOG)/i.test(file);
}

function relates(doc, body, file) {
  if (body.includes(file) || body.includes(path.basename(file))) return true;
  const a = stem(file);
  const b = stem(doc);
  let n = 0;
  while (n < a.length && n < b.length && a[n] === b[n]) n++;
  return n >= 5;
}

/** Find user-facing docs that describe a changed surface but were not updated with it. */
function closeout(repo, { changed = [] } = {}) {
  const changedSet = new Set(changed.map(normal));
  const surfaces = [...changedSet].filter((file) => !isDoc(file));
  const docs = walkMarkdown(repo).filter(userFacing);
  const stale = [];
  for (const doc of docs) {
    if (changedSet.has(doc)) continue;
    const body = fs.readFileSync(path.join(repo, doc), 'utf8');
    const cause = surfaces.find((file) => relates(doc, body, file));
    if (cause) stale.push({ file: doc, because: `${cause} changed but ${doc} describing the same surface was not updated in this change` });
  }
  const result = { allowed: stale.length === 0, stale, checked: docs.length };
  fs.mkdirSync(path.join(repo, '.rig', 'knowledge'), { recursive: true });
  fs.writeFileSync(path.join(repo, '.rig', 'knowledge', 'closeout.json'), JSON.stringify(result, null, 2) + '\n');
  return result;
}

// Append one line unless the key is already present; creates the file with its header if absent.
function addLine(abs, header, key, line) {
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  if (!fs.existsSync(abs)) fs.writeFileSync(abs, header);
  const cur = fs.readFileSync(abs, 'utf8');
  if (cur.includes(key)) return;
  fs.appendFileSync(abs, (cur && !cur.endsWith('\n') ? '\n' : '') + line + '\n');
}

/** File owner wording as a new, never-overwritten decision record and index it. */
function fileDecision(repo, { text, topics = [], date }) {
  const summary = text.replace(/\s+/g, ' ').trim().slice(0, 120);
  const slug = text.trim().split(/\s+/).slice(0, 6).join(' ').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'decision';
  const base = `wiki/reasoning/${date}-owner-decision-${slug}`;
  const record = `---\ndate: ${date}\nsource: intent owner\ntopics: ${topics.join(', ')}\ndecisions: \nstatus: current\nsummary: ${summary}\n---\n\n${text}\n`;
  fs.mkdirSync(path.join(repo, 'wiki', 'reasoning'), { recursive: true });
  let file = `${base}.md`;
  for (let n = 2; ; n++) {
    try {
      fs.writeFileSync(path.join(repo, file), record, { flag: 'wx' });
      break;
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
      file = `${base}-${n}.md`;
    }
  }
  for (const topic of topics) {
    addLine(path.join(repo, 'wiki', 'topics', `${topic}.md`), `# ${cap(topic)}\n`, file, `- ${file} - ${summary}`);
  }
  const index = 'wiki/index/decisions.md';
  addLine(path.join(repo, index), '# Decision index\n', file, `- ${date} ${file} [${topics.join(', ')}] - ${summary}`);
  return { path: file, index };
}

module.exports = { closeout, fileDecision };
