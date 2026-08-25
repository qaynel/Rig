#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const COMPLETED = new Set(['Done', 'Ready for Commit']);
const EVIDENCE = /→\s*`?(tests\/\S+\.test\.js)::([^`\n]+?)`?\s*$/;
const MANUAL = /→\s*`?manual:\s*(.+?)`?\s*$/;

function parseArgs(argv) {
  const args = { board: 'wiki/Tickets.md', tickets: 'wiki/tickets' };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--board') {
      args.board = argv[++i];
      continue;
    }
    if (argv[i] === '--tickets') {
      args.tickets = argv[++i];
      continue;
    }
  }
  return args;
}

function sectionCards(board) {
  const text = fs.readFileSync(board, 'utf8');
  const lines = text.split('\n');
  const cards = [];
  let column = null;
  let current = null;
  const flush = () => {
    if (current && COMPLETED.has(current.column)) cards.push(current);
    current = null;
  };
  for (const line of lines) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      flush();
      column = heading[1];
      continue;
    }
    if (column && /^- \[[ x]\]/.test(line)) {
      flush();
      current = { column, body: line };
      continue;
    }
    if (current) current.body += `\n${line}`;
  }
  flush();
  return cards;
}

function ticketPath(card, ticketsDir, board) {
  const match = card.body.match(/\[Solution\]\(([^)]+)\)/i)
    || card.body.match(/(tickets\/RIG-\d+\.md)/i);
  if (!match) return null;
  const rel = match[1];
  const name = path.basename(rel);
  const candidates = [
    path.join(ticketsDir, name),
    path.resolve(path.dirname(board), rel),
    path.join(ticketsDir, rel),
  ];
  return candidates.find((file) => fs.existsSync(file)) || candidates[0];
}

function ticketId(file, card) {
  const fromFile = path.basename(file || '', '.md');
  if (/^RIG-\d+$/.test(fromFile)) return fromFile;
  const fromCard = card.body.match(/RIG-\d+/);
  return fromCard ? fromCard[0] : 'unknown';
}

function acceptanceBullets(text) {
  const heading = text.search(/^## Acceptance\b/m);
  if (heading < 0) return [];
  const rest = text.slice(heading);
  const match = rest.match(/^## Acceptance[^\n]*\n([\s\S]*?)(?=\n## |\s*$)/);
  if (!match) return [];
  const bullets = [];
  let current = null;
  for (const line of match[1].split('\n')) {
    if (/^- /.test(line)) {
      if (current) bullets.push(current);
      current = line.replace(/^- /, '').trim();
    } else if (current && line.trim()) {
      current += ` ${line.trim()}`;
    } else if (current && !line.trim()) {
      bullets.push(current);
      current = null;
    }
  }
  if (current) bullets.push(current);
  return bullets;
}

function resolveTestFile(ref, board) {
  const candidates = [
    path.resolve(process.cwd(), ref),
    path.resolve(path.dirname(board), ref),
    path.resolve(path.dirname(board), path.basename(ref)),
  ];
  return candidates.find((file) => fs.existsSync(file)) || null;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const board = path.resolve(args.board);
  const ticketsDir = path.resolve(args.tickets);
  const violations = [];
  let manuals = 0;

  for (const card of sectionCards(board)) {
    const file = ticketPath(card, ticketsDir, board);
    const id = ticketId(file, card);
    if (!file || !fs.existsSync(file)) {
      violations.push(`${id}: missing ticket file`);
      continue;
    }
    const bullets = acceptanceBullets(fs.readFileSync(file, 'utf8'));
    if (!bullets.length) {
      violations.push(`${id}: missing evidence reference`);
      continue;
    }
    for (const bullet of bullets) {
      const manual = bullet.match(MANUAL);
      if (manual) {
        manuals += 1;
        continue;
      }
      const evidence = bullet.match(EVIDENCE);
      if (!evidence) {
        violations.push(`${id}: missing evidence reference`);
        continue;
      }
      const [, rel, title] = evidence;
      const testFile = resolveTestFile(rel, board);
      if (!testFile) {
        violations.push(`${id}: missing file ${rel}`);
        continue;
      }
      const body = fs.readFileSync(testFile, 'utf8');
      if (!body.includes(title)) {
        violations.push(`${id}: missing named test ${title}`);
      }
    }
  }

  for (const violation of violations) console.log(violation);
  console.log(`manual evidence: ${manuals}`);
  process.exit(violations.length ? 1 : 0);
}

main();
