#!/usr/bin/env node
'use strict';

// Authoring-time checks for the rebuild contract. The older signed
// validator and oracle remain untouched. Written approval is an owner declaration,
// not cryptographic proof of identity or presence (rebuild design 5.3).
const fs = require('node:fs');
const path = require('node:path');
const { createHash } = require('node:crypto');
const { spawnSync } = require('node:child_process');

const directory = 'wiki/gate1/rebuild/';
const idPattern = /^RB-[A-Z]+-[1-9]\d*$/;
const testPath = /^tests\/rebuild\/[A-Za-z0-9_-]+\.test\.js$/;
const sha256 = value => createHash('sha256').update(value).digest('hex');

// rig: recognize authored direct test('RB-ID title', ...) calls only; aliases
// and computed registration require a real parser and fail closed as missing.
function tokens(source) {
  const result = [];
  let i = 0;
  const push = (type, value) => result.push({ type, value });
  const canStartRegex = () => {
    const previous = result.at(-1);
    return !previous || (previous.type === 'punct' && ['(', '[', '{', '=', ',', ':', ';', '!', '?', '=>'].includes(previous.value))
      || (previous.type === 'id' && ['return', 'throw', 'case', 'typeof', 'void', 'delete', 'in', 'of', 'yield', 'await'].includes(previous.value));
  };
  while (i < source.length) {
    const c = source[i];
    if (/\s/.test(c)) { i += 1; continue; }
    if (source.startsWith('//', i)) { i = source.indexOf('\n', i + 2); if (i < 0) break; continue; }
    if (source.startsWith('/*', i)) { const end = source.indexOf('*/', i + 2); i = end < 0 ? source.length : end + 2; continue; }
    if (c === '"' || c === "'") {
      const quote = c;
      i += 1;
      let value = '';
      while (i < source.length && source[i] !== quote) {
        if (source[i] === '\\' && i + 1 < source.length) { value += source[i + 1]; i += 2; }
        else value += source[i++];
      }
      if (i < source.length) i += 1;
      push('string', value);
      continue;
    }
    if (c === '`') {
      i += 1;
      while (i < source.length) {
        if (source[i] === '\\') i += 2;
        else if (source[i++] === '`') break;
      }
      push('template', '');
      continue;
    }
    if (c === '/' && canStartRegex()) {
      i += 1;
      let inClass = false;
      while (i < source.length) {
        if (source[i] === '\\') i += 2;
        else if (source[i] === '[') { inClass = true; i += 1; }
        else if (source[i] === ']') { inClass = false; i += 1; }
        else if (source[i] === '/' && !inClass) { i += 1; while (/[a-z]/i.test(source[i] || '')) i += 1; break; }
        else if (source[i] === '\n') break;
        else i += 1;
      }
      push('regex', '');
      continue;
    }
    if (/[$\w]/.test(c)) {
      const start = i++;
      while (/[$\w]/.test(source[i] || '')) i += 1;
      push('id', source.slice(start, i));
      continue;
    }
    const punct = ['?.', '=>', '==', '!=', '&&', '||', '??', '++', '--'].find(value => source.startsWith(value, i)) || c;
    push('punct', punct);
    i += punct.length;
  }
  return result;
}

function provingDeclarations(source) {
  const parsed = tokens(source);
  const declarations = [];
  const errors = [];
  for (let i = 0; i < parsed.length; i += 1) {
    if (parsed[i].type !== 'id' || parsed[i].value !== 'test') continue;
    if (parsed[i + 1]?.value === '.' && ['skip', 'todo', 'only'].includes(parsed[i + 2]?.value) && parsed[i + 3]?.value === '(') {
      errors.push('disabled');
      continue;
    }
    if (parsed[i + 1]?.value !== '(' || ['.', '?.'].includes(parsed[i - 1]?.value)) continue;
    const title = parsed[i + 2];
    if (title?.type !== 'string' || !/^RB-[A-Z]+-[1-9]\d* /.test(title.value)) continue;
    let depth = 0;
    let firstComma = -1;
    let secondComma = -1;
    for (let j = i + 2; j < parsed.length; j += 1) {
      const value = parsed[j].value;
      if (['(', '[', '{'].includes(value)) depth += 1;
      else if ([')', ']', '}'].includes(value)) {
        if (value === ')' && depth === 0) break;
        depth -= 1;
      } else if (value === ',' && depth === 0) {
        if (firstComma < 0) firstComma = j;
        else { secondComma = j; break; }
      }
    }
    if (firstComma >= 0 && parsed[firstComma + 1]?.value === '{') {
      const end = secondComma < 0 ? parsed.length : secondComma;
      for (let j = firstComma + 2; j + 1 < end; j += 1) {
        const key = parsed[j].value;
        const disabledKey = ['skip', 'todo', 'only'].includes(key);
        if (disabledKey && [':', ',', '}'].includes(parsed[j + 1].value)
          || parsed[j].value === '[' && parsed[j + 1]?.type === 'string'
            && ['skip', 'todo', 'only'].includes(parsed[j + 1].value) && parsed[j + 2]?.value === ']' && parsed[j + 3]?.value === ':') errors.push('disabled');
      }
    }
    const callback = parsed[firstComma + 1];
    if (!callback || !['(', 'function', 'async'].includes(callback.value)
      && !(callback.type === 'id' && parsed[firstComma + 2]?.value === '=>')) errors.push('unsupported options or callback alias');
    declarations.push(title.value);
  }
  return { declarations, errors };
}

function sourceTreeDigest(root = process.cwd()) {
  const hash = createHash('sha256');
  const files = [];
  // Hash candidate source bytes and the local inputs consumed by proving tests.
  const add = file => {
    const full = path.join(root, file);
    if (!fs.existsSync(full)) return;
    const stat = fs.lstatSync(full);
    if (stat.isSymbolicLink()) throw new Error(`symlink in rebuild evidence sources: ${file}`);
    if (stat.isFile()) { files.push(file); return; }
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(full, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        add(path.posix.join(file.replaceAll(path.sep, '/'), entry.name));
      }
    }
  };
  const listed = spawnSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (listed.status === 0) {
    for (const file of [...new Set(listed.stdout.split('\0').filter(Boolean))].sort()) {
      const full = path.join(root, file);
      hash.update(file).update('\0');
      try {
        const stat = fs.lstatSync(full);
        hash.update(String(stat.mode & 0o777)).update('\0');
        hash.update(stat.isSymbolicLink() ? fs.readlinkSync(full) : fs.readFileSync(full));
      } catch (error) {
        if (error.code !== 'ENOENT') throw error;
        hash.update('missing');
      }
      hash.update('\0');
    }
  } else {
    for (const file of ['rig', 'scripts/rebuild', 'scripts/run-ai-sdlc.js', 'scripts/approve-gate1.js',
      'scripts/check-traceability.js', 'tests/rebuild', 'benchmarks', 'install', 'install.sh']) add(file);
  }
  // These inputs stay local/ignored, but changing them still invalidates evidence.
  for (const file of ['wiki/gate1/rebuild', 'wiki/specs/rebuild/role-map.json',
    'wiki/specs/rebuild/conflict-register.md', 'wiki/specs/rebuild/benchmark-results']) add(file);
  for (const file of files.sort()) {
    hash.update(file.replaceAll(path.sep, '/')).update('\0').update(fs.readFileSync(path.join(root, file))).update('\0');
  }
  return hash.digest('hex');
}

function currentGitHead(root = process.cwd()) {
  const result = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  return result.status === 0 && /^[a-f0-9]{40,64}$/i.test(result.stdout.trim()) ? result.stdout.trim().toLowerCase() : null;
}

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
      const parsed = provingDeclarations(body);
      if (parsed.errors.length) errors.push(`focused or disabled proving test in ${relative}`);
      for (const title of parsed.declarations) {
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
    if (approval) {
      if (!result.approved) errors.push('owner approval for the current contract manifest is pending');
      try {
        const evidence = JSON.parse(read('.context/rebuild/lane-results.json'));
        if (evidence.contract_manifest_sha256 !== result.digest) errors.push('rebuild lane evidence is for a stale contract manifest');
        if (evidence.git_head !== currentGitHead(root)) errors.push('rebuild lane evidence is for a stale Git head');
        if (evidence.source_tree_sha256 !== sourceTreeDigest(root)) errors.push('rebuild lane evidence is for a stale source tree');
        const statuses = new Map();
        for (const row of evidence.tests || []) {
          if (!row || !tests.has(row.id) || statuses.has(row.id) || !['pass', 'fail'].includes(row.status)) {
            errors.push('rebuild lane evidence has an unexpected, duplicate, or inactive test result');
          } else statuses.set(row.id, row.status);
        }
        for (const id of tests.keys()) if (!statuses.has(id)) errors.push(`rebuild lane evidence is missing ${id}`);
      } catch (error) {
        errors.push(`rebuild lane evidence unavailable: ${error.message}`);
      }
    }
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

module.exports = { checkContract, currentGitHead, sourceTreeDigest };
