#!/usr/bin/env node
// wiki/index/quick-reference.md routes agents by task and prints a line count
// beside each link so an agent can budget before opening a file. Those numbers
// are the page's entire value, so they must not rot. This checks them against
// the real files and rewrites them with --fix.
//
// Recognised shapes, where N is the count that follows a link on the same line:
//   | [Name](path) | N |          the "Read first" column
//   [Name](path) (N)              the "then, only if needed" column
//   [Name](path) (N lines)        prose
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const page = path.join(root, 'wiki/index/quick-reference.md');
const fix = process.argv.includes('--fix');

const dir = path.dirname(page);
const lines = fs.readFileSync(page, 'utf8').split('\n');
// A link, then anything that is not a link, then the first number after it.
const pattern = /\[[^\]]+\]\((?<target>[^)#\s]+)\)(?<gap>[^[\n]*?)(?<open>\|\s*|\(\s*)(?<count>\d+)(?<close>\s*(?:lines)?\s*[|)])/g;

const stale = [];
for (let i = 0; i < lines.length; i += 1) {
  lines[i] = lines[i].replace(pattern, (match, ...args) => {
    const g = args[args.length - 1];
    const file = path.normalize(path.join(dir, g.target));
    if (!g.target.endsWith('.md') || !fs.existsSync(file)) return match;
    const actual = fs.readFileSync(file, 'utf8').split('\n').length - 1;
    if (actual === Number(g.count)) return match;
    stale.push({ line: i + 1, target: g.target, was: Number(g.count), now: actual });
    return match.replace(`${g.open}${g.count}`, `${g.open}${actual}`);
  });
}

if (!stale.length) {
  console.log('size hints: all current');
  process.exit(0);
}

for (const s of stale) {
  console.error(`  wiki/index/quick-reference.md:${s.line} ${s.target}: says ${s.was}, actually ${s.now}`);
}

if (fix) {
  fs.writeFileSync(page, lines.join('\n'));
  console.log(`size hints: corrected ${stale.length}`);
  process.exit(0);
}

console.error(`\n${stale.length} stale size hint(s). Run: node scripts/check-size-hints.js --fix`);
process.exit(1);
