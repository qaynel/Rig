#!/usr/bin/env node
'use strict';

// The bounded read. wiki/agent-primer.md's links are advisory and unbounded;
// this is the middle mode that was missing — ask a scoped question, get an
// answer whose size you knew before you asked. The cap is the entire point:
// raising it past HARD_CAP is refused, because an unbounded answer is the
// thing this replaces.
const path = require('node:path');
const { traces } = require('./build-wiki-index');

const ROOT = path.join(__dirname, '..');
const DEFAULT_LIMIT = 12;
const HARD_CAP = 40;

const USAGE = `Usage: node scripts/wiki-query.js [--topic <slug>] [--tag <tag>]
       [--status current|superseded|historical] [--since YYYY-MM-DD]
       [--decision <id>] [--text <substring>] [--limit <n>]

Returns matching reasoning traces, newest first, at most ${HARD_CAP}.
Topic slugs are the filenames in wiki/topics/ without the .md extension.`;

function parse(argv) {
  const options = {};
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (!flag.startsWith('--')) throw new Error(`unknown argument: ${flag}`);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`${flag} needs a value`);
    options[flag.slice(2)] = value;
    i += 1;
  }
  return options;
}

function matches(trace, options) {
  if (options.topic && !trace.topics.includes(options.topic)) return false;
  if (options.tag && !trace.tags.includes(options.tag)) return false;
  if (options.status && trace.status !== options.status) return false;
  if (options.decision && !trace.decisions.includes(options.decision)) return false;
  if (options.since && trace.date < options.since) return false;
  if (options.text && !`${trace.file} ${trace.summary}`.toLowerCase().includes(options.text.toLowerCase())) return false;
  return true;
}

function query(root = ROOT, options = {}) {
  // traces() already sorts newest first.
  const matched = traces(root).filter((trace) => matches(trace, options));
  const requested = Number(options.limit) || DEFAULT_LIMIT;
  const limit = Math.max(1, Math.min(requested, HARD_CAP));
  return { rows: matched.slice(0, limit), total: matched.length, limit };
}

function render(result) {
  if (!result.total) return 'No traces match. Widen the query or drop a filter.\n';
  const lines = result.rows.map((trace) => `${trace.date}  wiki/${trace.file}\n            ${trace.summary || '(no summary filed)'}`);
  const withheld = result.total - result.rows.length;
  if (withheld > 0) {
    lines.push(`\n${withheld} more match. Narrow with --topic/--status/--since, or raise --limit (max ${HARD_CAP}).`);
  }
  return `${lines.join('\n')}\n`;
}

if (require.main === module) {
  const argv = process.argv.slice(2);
  if (argv.includes('--help') || argv.includes('-h')) {
    console.log(USAGE);
    process.exit(0);
  }
  try {
    process.stdout.write(render(query(ROOT, parse(argv))));
  } catch (error) {
    console.error(`${error.message}\n\n${USAGE}`);
    process.exit(2);
  }
}

module.exports = { DEFAULT_LIMIT, HARD_CAP, parse, query, render };
