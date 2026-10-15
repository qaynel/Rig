#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const ROOT = path.resolve(__dirname, '..');
const STATES = new Set(['open', 'ready-for-qa', 'delivered', 'redesign']);
const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function trackerFailures(rows, board, tickets, live, phase) {
  const failures = [];
  const ids = new Set();
  const issues = new Map();
  for (const row of rows) {
    if (!/^RIG-\d+(?:\.\d+)?$/.test(row.id) || ids.has(row.id) || !STATES.has(row.state)
        || !/^RIG-\d+\.md$/.test(row.ticket)) {
      failures.push(`invalid/duplicate tracker declaration: ${row.id}`);
      continue;
    }
    ids.add(row.id);
    if (row.issue !== null && (!Number.isInteger(row.issue) || row.issue <= 0 || issues.has(row.issue))) {
      failures.push(`invalid/duplicate GitHub issue: ${row.id}`);
      continue;
    }
    if (row.issue !== null) issues.set(row.issue, row);
    const declared = new RegExp(`\\*\\*Delivery state \\(${escape(row.id)}\\):\\*\\* ${escape(row.state)}(?:\\s|$)`);
    const cards = [...board.matchAll(/^- \[[ xX]\] \*\*(RIG-\d+(?:\.\d+)?)\b[^\n]*\n(?:(?!^- \[[ xX]\]|^## ).*\n?)*/gm)]
      .filter((m) => m[1] === row.id);
    if (cards.length !== 1 || !declared.test(cards[0]?.[0] || '')) failures.push(`${row.id}: board state differs from declaration`);
    if (!declared.test(tickets.get(row.ticket) || '')) failures.push(`${row.id}: ticket state differs from declaration`);
    const target = row.github_to;
    const wantedState = ['redesign', 'delivered'].includes(row.state) ? 'CLOSED' : 'OPEN';
    const wantedReason = row.state === 'redesign' ? 'NOT_PLANNED' : row.state === 'delivered' ? 'COMPLETED' : null;
    if (!target || target.state !== wantedState || (target.stateReason || null) !== wantedReason) failures.push(`${row.id}: invalid target transition`);
    if (live === null) continue;
    if (row.issue === null) { failures.push(`${row.id}: GitHub issue creation pending`); continue; }
    const issue = live.find((item) => item.number === row.issue);
    const expected = phase === 'candidate' ? row.github_from : row.github_to;
    if (!issue || !expected || issue.state !== expected.state || (issue.stateReason || null) !== (expected.stateReason || null)) {
      failures.push(`${row.id}: GitHub state/reason differs from ${phase} declaration`);
    }
    if (phase === 'delivered' && row.state === 'redesign' && !issue?.labels?.some((label) => (label.name || label) === 'redesign')) {
      failures.push(`${row.id}: GitHub redesign label missing`);
    }
  }
  for (const id of [...board.matchAll(/^- \[[ xX]\] \*\*(RIG-\d+(?:\.\d+)?)\b/gm)].map((m) => m[1])) {
    if (!ids.has(id)) failures.push(`${id}: unmapped board item`);
  }
  for (const issue of live || []) {
    const id = issue.title?.match(/\bRIG-\d+(?:\.\d+)?\b/)?.[0];
    if (id && !issues.has(issue.number)) failures.push(`${id}: unmapped GitHub issue #${issue.number}`);
  }
  return failures;
}

function doctrineFailures(text) {
  const failures = [];
  for (const line of text.split('\n')) {
    if (/^\s*>|retired|deprecated|historical|no longer|never assert|do not assert/i.test(line)) continue;
    if (/(?:must|stays?|remain)\s+(?:strictly\s+)?markdown-only|never ship scripts|no (?:scripts|runtime|MCP)(?:,| or| may)/i.test(line)) failures.push(`active retired doctrine: ${line.trim()}`);
  }
  return failures;
}

function docFailures(text, version, help) {
  const failures = [];
  for (const match of text.matchAll(/^(?:#+ Rig |\*\*Current release:\*\* v?)(\d+\.\d+\.\d+)/gm)) {
    if (match[1] !== version) failures.push(`current version ${match[1]} differs from ${version}`);
  }
  for (const block of text.matchAll(/```(?:sh|bash)\n([\s\S]*?)```/g)) {
    for (const line of block[1].split('\n')) {
      const command = line.match(/(?:\.rig\/bin\/rig|node rig\/materialize\.js)\s+([a-z][a-z-]*)/);
      if (!command) continue;
      if (!new RegExp(`\\b${escape(command[1])}\\b`).test(help)) failures.push(`documented command missing from help: ${command[1]}`);
      for (const flag of line.match(/--[a-z][a-z-]*/g) || []) {
        if (!help.includes(flag)) failures.push(`documented flag missing from help: ${flag}`);
      }
    }
  }
  return failures;
}

async function fetchIssues(token, repo) {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('invalid GitHub repository');
  const issues = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(`https://api.github.com/repos/${repo}/issues?state=all&per_page=100&page=${page}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error(`GitHub tracker API failed: HTTP ${response.status}`);
    const batch = await response.json();
    if (!Array.isArray(batch)) throw new Error('GitHub tracker API returned invalid data');
    issues.push(...batch.filter((issue) => !issue.pull_request).map((issue) => ({
      number: issue.number, title: issue.title, state: issue.state.toUpperCase(),
      stateReason: issue.state === 'open' ? null : (issue.state_reason || '').toUpperCase(), labels: issue.labels,
    })));
    if (batch.length < 100) return issues;
  }
}

async function main() {
  const phase = process.argv.includes('--delivered') ? 'delivered' : 'candidate';
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (!token && process.env.CI) throw new Error('CI tracker check requires a read-only GitHub token');
  let live = null;
  if (token) live = await fetchIssues(token, process.env.GITHUB_REPOSITORY || 'qaynel/Rig');
  else console.log('coherence: GitHub tracker comparison SKIPPED (no token; local checks only)');
  const rows = JSON.parse(fs.readFileSync(path.join(ROOT, 'wiki/specs/close-everything/tracker-transitions.json'))).items;
  const tickets = new Map([...new Set(rows.map((r) => r.ticket))].map((file) => [file, fs.readFileSync(path.join(ROOT, 'wiki/tickets', file), 'utf8')]));
  const failures = trackerFailures(rows, fs.readFileSync(path.join(ROOT, 'wiki/Tickets.md'), 'utf8'), tickets, live, phase);
  const help = spawnSync(process.execPath, ['rig/materialize.js', '--help'], { cwd: ROOT, encoding: 'utf8' });
  if (help.status !== 0) failures.push('materializer help failed');
  const version = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'))).version;
  for (const rel of ['README.md', 'docs/install.md']) {
    if (!fs.existsSync(path.join(ROOT, rel))) { failures.push(`missing ${rel}`); continue; }
    failures.push(...docFailures(fs.readFileSync(path.join(ROOT, rel), 'utf8'), version, help.stdout).map((f) => `${rel}: ${f}`));
  }
  for (const rel of ['CLAUDE.md', 'GEMINI.md', 'rig/corpus/rules/repo-instructions.md', 'rig/corpus/routing.md']) {
    failures.push(...doctrineFailures(fs.readFileSync(path.join(ROOT, rel), 'utf8')).map((f) => `${rel}: ${f}`));
  }
  const corpus = spawnSync(process.execPath, ['scripts/check-rule-copies.js'], { cwd: ROOT, encoding: 'utf8' });
  if (corpus.status !== 0) failures.push(`corpus projection/uniqueness: ${corpus.stderr.trim()}`);
  const evidence = spawnSync(process.execPath, ['scripts/check-test-evidence.js'], { cwd: ROOT, encoding: 'utf8' });
  if (evidence.status !== 0) failures.push(`proving-test evidence: ${(evidence.stdout + evidence.stderr).trim()}`);
  if (failures.length) throw new Error(failures.join('\n'));
  console.log(`coherence: docs, instructions, corpus and ${rows.length} declared tracker transitions agree (${phase})`);
}

if (require.main === module) main().catch((error) => { console.error(error.message); process.exitCode = 1; });
module.exports = { trackerFailures, doctrineFailures, docFailures, fetchIssues };
