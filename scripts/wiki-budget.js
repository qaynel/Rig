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

// Only dated trace filenames. wiki/reasoning/README.md is a convention page,
// not a trace, and linking it from a mandated read is correct.
const TRACE_LINK = /\]\((?:\.{1,2}\/)*(reasoning\/\d{4}-\d{2}-\d{2}-[^)#\s]+\.md)/g;

// The four pages a full-cadence task always opens must route only to current
// thinking. Hubs one hop deeper may and should cite historical traces: a hub
// is the synthesis and the trace is its source, and wiki/reasoning/README.md
// requires the citation. Enforcing this on hubs would order agents to break
// the wiki's own filing contract.
function entryLinkViolations(root, config) {
  const status = new Map(traces(root).map((trace) => [trace.file, trace.status]));
  const found = [];
  for (const relative of config.mandatoryReads) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) {
      found.push({ rule: 'entry-path-missing', subject: relative, actual: 'absent', limit: 'update wiki/budget.json' });
      continue;
    }
    const body = fs.readFileSync(absolute, 'utf8');
    for (const target of new Set([...body.matchAll(TRACE_LINK)].map((match) => match[1]))) {
      const state = status.get(target) || 'missing';
      if (state === 'current') continue;
      found.push({
        rule: 'entry-path-current-only',
        subject: `${relative} -> ${target}`,
        actual: state,
        limit: 'current',
      });
    }
  }
  return found;
}

// Per-file caps do not bound the sum, and the sum is the symptom: orientation
// cost was 211,775 bytes (~53k tokens) on 2026-09-05 before a single primary
// source was opened. A missing page fails loudly rather than shrinking the
// measured total, so splitting a page cannot silently satisfy the budget.
//
// GENERATED pages (wiki/status.md, wiki/index/reasoning.md) are excluded from
// the sum even when they appear in entryPath: they are rebuilt by
// build-wiki-index.js and grow by design every time the project's own
// mandated workflow files a dated trace, so a byte cap on them fails with no
// legal fix -- the same reasoning Task 1 applied to exempt them from the hub
// and index caps. They are still checked for existence: a generated page
// that has gone missing fails as entry-path-missing rather than being
// skipped outright. The tradeoff is explicit: a generated page's real read
// cost stops being counted toward entry-path-bytes, even though an agent
// still pays to read it.
function orientationViolations(root, config, limits) {
  const found = [];
  let bytes = 0;
  for (const relative of config.entryPath) {
    const absolute = path.join(root, relative);
    if (!fs.existsSync(absolute)) {
      found.push({ rule: 'entry-path-missing', subject: relative, actual: 'absent', limit: 'update wiki/budget.json' });
      continue;
    }
    if (GENERATED.has(relative)) continue;
    bytes += fs.statSync(absolute).size;
  }
  if (bytes > limits.entryPathBytes) {
    found.push({
      rule: 'entry-path-bytes',
      subject: 'wiki/agent-primer.md and the pages it links',
      actual: bytes,
      limit: limits.entryPathBytes,
    });
  }
  return found;
}

function audit(root = ROOT) {
  const config = readConfig(root);
  const found = [
    ...summaryViolations(root),
    ...hubViolations(root, config.limits),
    ...indexViolations(root, config.limits),
    ...entryLinkViolations(root, config),
    ...orientationViolations(root, config, config.limits),
  ];
  // mandatoryReads is a subset of entryPath in practice, so a page missing
  // from both would otherwise surface as two byte-identical entry-path-missing
  // violations. Keep the first occurrence.
  const seen = new Set();
  return found.filter((violation) => {
    const key = `${violation.rule}:${violation.subject}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

module.exports = { CONFIG, GENERATED, WAIVERS, audit, pages, readConfig };
