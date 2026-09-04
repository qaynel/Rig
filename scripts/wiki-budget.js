#!/usr/bin/env node
'use strict';

// Measures the wiki's read cost against the caps in wiki/budget.json. This
// module is pure measurement: it reports what is over budget and says nothing
// about whether that is allowed. Waivers, exit codes, and printing belong to
// scripts/check-wiki-budget.js.
const fs = require('node:fs');
const path = require('node:path');
const { traces } = require('./build-wiki-index');

const ROOT = path.join(__dirname, '..');
const CONFIG = path.join('wiki', 'budget.json');
const WAIVERS = path.join('wiki', 'budget.waivers.json');

// Rebuilt by scripts/build-wiki-index.js and forbidden to hand-edit, so a size
// cap on them would fail the build with no legal fix. They stay inside the
// entry-path byte budget, where the fix is to change what links to them.
const GENERATED = new Set([
  path.posix.join('wiki', 'status.md'),
  path.posix.join('wiki', 'index', 'reasoning.md'),
]);

function readConfig(root) {
  return JSON.parse(fs.readFileSync(path.join(root, CONFIG), 'utf8'));
}

function pages(root, directory) {
  const absolute = path.join(root, 'wiki', directory);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute)
    .filter((name) => name.endsWith('.md') && name !== 'README.md')
    .sort()
    .map((name) => {
      const body = fs.readFileSync(path.join(absolute, name), 'utf8');
      return {
        relative: path.posix.join('wiki', directory, name),
        bytes: Buffer.byteLength(body),
        // Trailing-newline convention: a file ending in "\n" has as many rows
        // as newlines, which is what `wc -l` reports and what the caps mean.
        rows: body.split('\n').length - 1,
      };
    })
    .filter((page) => !GENERATED.has(page.relative));
}

// A populated summary lets an agent triage a trace from the index without
// opening the body — wiki/reasoning/README.md calls this the single
// highest-ROI context-debloat lever this project has identified.
function summaryViolations(root) {
  return traces(root)
    .filter((trace) => !trace.summary)
    .map((trace) => ({
      rule: 'trace-summary',
      subject: path.posix.join('wiki', trace.file),
      actual: 'missing',
      limit: 'one line',
    }));
}

function hubViolations(root, limits) {
  return pages(root, 'topics')
    .filter((page) => page.bytes > limits.hubBytes)
    .map((page) => ({
      rule: 'hub-bytes', subject: page.relative, actual: page.bytes, limit: limits.hubBytes,
    }));
}

// An index is a flat lookup, so it is capped on length and on prose creeping
// into its rows. wiki/index/decisions.md fails both at 314 rows / 177 bytes
// per row against a page the primer describes as "one line each".
function indexViolations(root, limits) {
  const found = [];
  for (const page of pages(root, 'index')) {
    if (page.rows > limits.indexRows) {
      found.push({ rule: 'index-rows', subject: page.relative, actual: page.rows, limit: limits.indexRows });
    }
    if (page.bytes > limits.indexBytes) {
      found.push({ rule: 'index-bytes', subject: page.relative, actual: page.bytes, limit: limits.indexBytes });
    }
  }
  return found;
}

function audit(root = ROOT) {
  const config = readConfig(root);
  return [
    ...summaryViolations(root),
    ...hubViolations(root, config.limits),
    ...indexViolations(root, config.limits),
  ];
}

module.exports = { CONFIG, GENERATED, WAIVERS, audit, pages, readConfig };
