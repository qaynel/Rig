#!/usr/bin/env node
// Completed-card traceability guard (RIG-131). A card in Done or Ready for
// Commit is evidence only when each ## Acceptance bullet names a present test
// (`→ tests/<file>.test.js::<exact title>`) or an explicit `→ manual: <reason>`.
// Missing, invented, or renamed titles fail the gate. Manual evidence is
// counted on every run so it cannot become a silent escape hatch.
'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.join(__dirname, '..');

function arg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  if (index !== -1 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

const boardPath = path.resolve(arg('--board', path.join(repoRoot, 'wiki/Tickets.md')));
const ticketsDir = path.resolve(arg('--tickets', path.join(repoRoot, 'wiki/tickets')));

const COMPLETED = new Set(['Done', 'Ready for Commit']);
const ACCEPTANCE_HEADING = /^## Acceptance(?:\s*\([^)]*\))?\s*$/;
const CARD_START = /^- \[[ xX]\] /;
const SOLUTION_LINK = /\[Solution\]\(([^)]+)\)/i;
const TEST_EVIDENCE = /→\s*`?(tests\/[A-Za-z0-9._/-]+\.test\.js)::([^`\n]+?)`?\s*$/;
const MANUAL_EVIDENCE = /→\s*`?manual:\s*(.+?)`?\s*$/i;

function read(file) {
  return fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
}

function sections(text) {
  const lines = text.split('\n');
  const found = [];
  let current = { title: '', lines: [] };
  for (const line of lines) {
    const heading = line.match(/^## (.+)$/);
    if (heading) {
      found.push(current);
      current = { title: heading[1].trim(), lines: [] };
    } else {
      current.lines.push(line);
    }
  }
  found.push(current);
  return found;
}

function cards(sectionLines) {
  const found = [];
  let current = null;
  for (const line of sectionLines) {
    if (CARD_START.test(line)) {
      if (current) found.push(current);
      current = line;
    } else if (current !== null) {
      current += `\n${line}`;
    }
  }
  if (current) found.push(current);
  return found;
}

function ticketIdFrom(fileName) {
  return fileName.replace(/\.md$/i, '');
}

function resolveTestFile(relPath) {
  if (!relPath || relPath.includes('..') || path.isAbsolute(relPath)) return null;
  const basename = path.basename(relPath);
  const dirs = [repoRoot, path.dirname(boardPath), path.dirname(ticketsDir)];
  const seen = new Set();
  for (const dir of dirs) {
    for (const candidate of [path.join(dir, relPath), path.join(dir, basename)]) {
      const absolute = path.resolve(candidate);
      if (seen.has(absolute)) continue;
      seen.add(absolute);
      try {
        if (fs.statSync(absolute).isFile()) return absolute;
      } catch {
        // try the next candidate
      }
    }
  }
  return null;
}

function acceptanceSection(text) {
  const lines = text.split('\n');
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (ACCEPTANCE_HEADING.test(lines[i])) {
      start = i + 1;
      break;
    }
  }
  if (start === -1) return null;
  let end = lines.length;
  for (let i = start; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start, end).join('\n');
}

function bullets(section) {
  const items = [];
  let current = null;
  for (const line of section.split('\n')) {
    const match = line.match(/^\s{0,3}[-*]\s+(.*)$/);
    if (match) {
      if (current !== null) items.push(current.trim());
      current = match[1];
    } else if (current !== null) {
      current += `\n${line}`;
    }
  }
  if (current !== null) items.push(current.trim());
  return items.filter(Boolean);
}

function parseEvidence(bullet) {
  const trimmed = bullet.trim();
  const testMatch = trimmed.match(TEST_EVIDENCE);
  if (testMatch) {
    return { kind: 'test', file: testMatch[1], title: testMatch[2].trim() };
  }
  const manualMatch = trimmed.match(MANUAL_EVIDENCE);
  if (manualMatch) {
    return { kind: 'manual', reason: manualMatch[1].trim() };
  }
  return null;
}

const violations = [];
let manualCount = 0;

if (!fs.existsSync(boardPath)) {
  console.error(`board not found: ${boardPath}`);
  process.exit(1);
}

const board = read(boardPath);
for (const section of sections(board)) {
  if (!COMPLETED.has(section.title)) continue;
  for (const card of cards(section.lines)) {
    const link = card.match(SOLUTION_LINK);
    if (!link) {
      violations.push('completed card has no Solution link and therefore no evidence');
      continue;
    }
    const ticketFile = path.join(ticketsDir, path.basename(link[1]));
    const id = ticketIdFrom(path.basename(ticketFile));
    if (!fs.existsSync(ticketFile)) {
      violations.push(`${id}: ticket file not found (${ticketFile})`);
      continue;
    }
    const sectionBody = acceptanceSection(read(ticketFile));
    if (sectionBody === null) {
      violations.push(`${id}: no ## Acceptance section with evidence`);
      continue;
    }
    const items = bullets(sectionBody);
    if (items.length === 0) {
      violations.push(`${id}: ## Acceptance has no evidence bullets`);
      continue;
    }
    for (const item of items) {
      const evidence = parseEvidence(item);
      if (!evidence) {
        violations.push(`${id}: acceptance bullet has no evidence reference`);
        continue;
      }
      if (evidence.kind === 'manual') {
        if (!evidence.reason) {
          violations.push(`${id}: manual evidence is missing a reason`);
        } else {
          manualCount += 1;
        }
        continue;
      }
      const testFile = resolveTestFile(evidence.file);
      if (!testFile) {
        violations.push(`${id}: ${evidence.file} does not exist`);
        continue;
      }
      const source = read(testFile);
      if (!source.includes(evidence.title)) {
        violations.push(`${id}: ${evidence.file} does not contain test title "${evidence.title}"`);
      }
    }
  }
}

for (const violation of violations) console.error(violation);
console.log(`manual evidence: ${manualCount}`);
process.exit(violations.length ? 1 : 0);
