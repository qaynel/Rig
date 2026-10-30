#!/usr/bin/env node
'use strict';

// Authoring-time checks for the rebuild's unsigned draft. The older signed
// validator and oracle remain untouched. Written approval is an owner declaration,
// not cryptographic proof of identity or presence (rebuild design 5.3).
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');

const directory = 'wiki/gate1/rebuild/';
const idPattern = /^RB-[A-Z]+-[1-9]\d*$/;
const testPath = /^tests\/rebuild\/[A-Za-z0-9_-]+\.test\.js$/;
const sha256 = value => createHash('sha256').update(value).digest('hex');

function checkContract(root = process.cwd(), { hashes = true, approval = false } = {}) {
  const errors = [];
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const result = { errors, counts: { requirements: 0, criteria: 0, tests: 0 }, digest: null, approved: false };
  try {
    function table(file, pattern, kind) {
      const found = new Map();
      for (const line of read(directory + file).split('\n')) {
        const cells = line.trim().split('|').slice(1, -1).map(cell => cell.trim().replace(/`/g, ''));
        if (!pattern.test(cells[0] || '')) continue;
        if (found.has(cells[0])) errors.push(`duplicate ${kind} ${cells[0]}`);
        found.set(cells[0], cells);
      }
      return found;
    }
    const requirements = table('requirements.md', idPattern, 'requirement');
    const criteria = table('acceptance.md', /^AC-RB-[A-Z]+-[1-9]\d*$/, 'criterion');
    const manifest = JSON.parse(read(directory + 'test-manifest.json'));
    if (!Array.isArray(manifest)) throw new Error('test manifest must be an array');
    const tests = new Map();
    const titles = new Set();
    for (const row of manifest) {
      if (!row || !idPattern.test(row.id || '')) { errors.push('invalid test manifest ID'); continue; }
      if (tests.has(row.id)) errors.push(`duplicate proving test ${row.id}`);
      tests.set(row.id, row);
      if (!testPath.test(row.file || '')) errors.push(`invalid proving-test path for ${row.id}`);
      if (!['unit', 'installed-repo', 'benchmark'].includes(row.lane)) errors.push(`invalid lane for ${row.id}`);
      if (typeof row.title !== 'string' || !row.title.startsWith(`${row.id} `)) errors.push(`invalid test title for ${row.id}`);
      if (titles.has(row.title)) errors.push(`duplicate test title ${row.title}`);
      titles.add(row.title);
    }
    result.counts = { requirements: requirements.size, criteria: criteria.size, tests: tests.size };
    if (!requirements.size) errors.push('contract has no requirements');
    for (const [id, cells] of requirements) {
      if (cells.length !== 5 || !cells[1] || !cells[2] || cells[3] !== `AC-${id}` || cells[4] !== id) errors.push(`invalid requirement mapping ${id}`);
      const criterion = criteria.get(`AC-${id}`);
      if (!criterion || criterion.length !== 3 || criterion[1] !== id || !criterion[2]) errors.push(`missing or invalid criterion for ${id}`);
      if (tests.get(id)?.criterion !== `AC-${id}`) errors.push(`missing or invalid proving test for ${id}`);
    }
    for (const [id, cells] of criteria) if (!requirements.has(cells[1]) || id !== `AC-${cells[1]}`) errors.push(`orphan criterion ${id}`);
    for (const id of tests.keys()) if (!requirements.has(id)) errors.push(`orphan proving test ${id}`);

    const files = fs.readdirSync(path.join(root, 'tests/rebuild')).filter(file => file.endsWith('.test.js')).sort();
    const declarations = new Map();
    for (const file of files) {
      const relative = `tests/rebuild/${file}`;
      const body = read(relative);
      if (/\btest\.(?:skip|todo|only)\s*\(/.test(body)) errors.push(`focused or disabled proving test in ${relative}`);
      for (const match of body.matchAll(/\btest\s*\(\s*(['"`])(RB-[^\n]*?)\1/g)) {
        const title = match[2];
        const id = title.split(' ')[0];
        if (declarations.has(title)) errors.push(`duplicate test declaration ${title}`);
        declarations.set(title, relative);
        const row = tests.get(id);
        if (!row || row.title !== title || row.file !== relative) errors.push(`orphan or misplaced declaration ${id}`);
      }
    }
    for (const row of tests.values()) if (declarations.get(row.title) !== row.file) errors.push(`missing test declaration ${row.id}`);

    const contents = read(directory + 'contract.manifest');
    result.digest = sha256(contents);
    if (hashes) {
      const expected = new Set(['requirements.md', 'acceptance.md', 'test-manifest.json'].map(file => directory + file));
      expected.add('tests/rebuild/_harness.js');
      for (const file of files) expected.add(`tests/rebuild/${file}`);
      const listed = new Set();
      for (const line of contents.trim().split('\n')) {
        const match = /^([a-f0-9]{64})  (.+)$/.exec(line);
        if (!match) { errors.push('malformed protected manifest row'); continue; }
        const [, digest, file] = match;
        if (!expected.has(file)) { errors.push(`unexpected protected file ${file}`); continue; }
        if (listed.has(file)) errors.push(`duplicate protected file ${file}`);
        listed.add(file);
        if (sha256(fs.readFileSync(path.join(root, file))) !== digest) errors.push(`changed protected file ${file}`);
      }
      for (const file of expected) if (!listed.has(file)) errors.push(`missing protected file ${file}`);
    }
    const reasoning = path.join(root, 'wiki/reasoning');
    if (fs.existsSync(reasoning)) {
      result.approved = fs.readdirSync(reasoning)
        .filter(file => /^\d{4}-\d{2}-\d{2}-rebuild-contract-approval-owner\.md$/.test(file))
        .some(file => {
          const body = read(`wiki/reasoning/${file}`);
          const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/.exec(body);
          const words = frontmatter ? body.slice(frontmatter[0].length) : '';
          return frontmatter && /^source: intent owner\s*$/m.test(frontmatter[1])
            && new RegExp(`\\b${result.digest}\\b`).test(words) && /\bI authori[sz]e\b/i.test(words);
        });
    }
    if (approval && !result.approved) errors.push('owner approval for the current contract manifest is pending');
    if (errors.length) result.approved = false;
  } catch (error) {
    errors.push(error.message);
    result.approved = false;
  }
  return result;
}

if (require.main === module) {
  const index = process.argv.indexOf('--root');
  const result = checkContract(index < 0 ? process.cwd() : process.argv[index + 1], { approval: process.argv.includes('--approval') });
  if (process.argv.includes('--json')) console.log(JSON.stringify(result, null, 2));
  else console.log(result.errors.length ? result.errors.join('\n') : `rebuild graph complete: ${result.counts.requirements} requirements; owner approval ${result.approved ? 'recorded' : 'pending'}; SHA-256 ${result.digest}`);
  process.exitCode = result.errors.length ? 1 : 0;
}

module.exports = { checkContract };
