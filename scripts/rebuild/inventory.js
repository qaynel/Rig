'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const RULE_FILES = new Set(['claude.md', 'agents.md', 'gemini.md']);
const COMMIT_RE = /^[0-9a-f]{40}$/i;

function parseArgs(args) {
  const values = {};
  for (let i = 0; i < args.length; i += 1) {
    if (!['--fork', '--zips', '--out'].includes(args[i]) || !args[i + 1]) {
      throw new Error('Usage: node scripts/rebuild/inventory.js --fork <dir> --zips <dir> --out <file>');
    }
    values[args[i].slice(2)] = args[++i];
  }
  if (!values.fork || !values.zips || !values.out) {
    throw new Error('Usage: node scripts/rebuild/inventory.js --fork <dir> --zips <dir> --out <file>');
  }
  return values;
}

// Owner ruling 2026-10-31 (register C12): no folder is skipped; classification, not discovery, excludes test scaffolding.
function walk(root) {
  const files = [];
  if (fs.lstatSync(root).isSymbolicLink()) throw new Error(`Symlinked upstream root is not supported: ${root}`);
  const realRoot = fs.realpathSync(root);
  // Resolve links inside the fork only; cycles and links outside this upstream fail closed.
  function insideRoot(target) {
    const rel = path.relative(realRoot, target);
    return rel === '' || (!path.isAbsolute(rel) && rel !== '..' && !rel.startsWith(`..${path.sep}`));
  }
  function visit(dir, ancestors = new Set()) {
    const realDir = fs.realpathSync(dir);
    if (ancestors.has(realDir)) throw new Error(`Symlink cycle inside upstream: ${relative(root, dir) || '.'}`);
    const nextAncestors = new Set(ancestors).add(realDir);
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      const file = path.join(dir, entry.name);
      if (entry.isSymbolicLink()) {
        let target;
        let stats;
        try {
          target = fs.realpathSync(file);
          stats = fs.statSync(file);
        } catch (error) {
          throw new Error(`Broken symlink inside upstream: ${relative(root, file)} (${error.message})`);
        }
        if (!insideRoot(target)) throw new Error(`Symlink escapes upstream: ${relative(root, file)} -> ${target}`);
        if (stats.isDirectory()) {
          visit(file, nextAncestors);
        } else if (stats.isFile()) {
          files.push(file);
        } else {
          throw new Error(`Unsupported symlink target inside upstream: ${relative(root, file)}`);
        }
        continue;
      }
      if (entry.isDirectory()) {
        visit(file, nextAncestors);
      } else if (entry.isFile()) {
        files.push(file);
      }
    }
  }
  visit(root);
  return files;
}

function relative(root, file) {
  return path.relative(root, file).split(path.sep).join('/');
}

function digest(file) {
  const bytes = fs.readFileSync(file);
  return { sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
}

function parseFrontmatter(text) {
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  const values = {};
  if (!match) return values;
  const lines = match[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    const field = lines[i].match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!field) continue;
    const [, key, raw] = field;
    if (raw === '>' || raw === '|') {
      const parts = [];
      while (i + 1 < lines.length && /^\s+/.test(lines[i + 1])) parts.push(lines[++i].trim());
      values[key] = parts.join(raw === '>' ? ' ' : '\n');
    } else {
      values[key] = raw.replace(/^(['"])(.*)\1$/, '$2').trim();
    }
  }
  return values;
}

function licenseInfo(files, root) {
  const file = files.filter((candidate) => !relative(root, candidate).includes('/') && /^(licen[cs]e(?:\..*)?|copying(?:\..*)?)$/i.test(path.basename(candidate))).sort((a, b) => a.localeCompare(b))[0];
  if (!file) return { licence: 'UNKNOWN', licenceFile: '' };
  const text = fs.readFileSync(file, 'utf8');
  const normalized = text.replace(/[“”]/g, '"').replace(/\s+/g, ' ');
  let licence = 'UNKNOWN';
  const hasSpdx = (id) => new RegExp(`SPDX-License-Identifier:\\s*${id}\\b`, 'i').test(text);
  const standardMitText = /Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files/i.test(normalized)
    && /The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software/i.test(normalized)
    && /THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND/i.test(normalized);
  if (hasSpdx('MIT') || standardMitText) licence = 'MIT';
  else if (hasSpdx('Apache-2\\.0') || /Apache License Version 2\.0, January 2004 http:\/\/www\.apache\.org\/licenses\//i.test(normalized)) licence = 'Apache-2.0';
  else if (hasSpdx('BSD-3-Clause') || (/Redistribution and use in source and binary forms.*Neither the name/i.test(normalized) && /THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"/i.test(normalized))) licence = 'BSD-3-Clause';
  else if (hasSpdx('BSD-2-Clause') || (/Redistribution and use in source and binary forms.*provided that the following conditions/i.test(normalized) && /THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"/i.test(normalized))) licence = 'BSD-2-Clause';
  else if (hasSpdx('ISC') || (/Permission to use, copy, modify, and\/or distribute this software/i.test(text) && /THE SOFTWARE IS PROVIDED "AS IS"/i.test(text))) licence = 'ISC';
  return { licence, licenceFile: relative(root, file) };
}

function piece(root, file, kind, name = '', description = '') {
  return { kind, path: relative(root, file), name, description, ...digest(file) };
}

function discoverPieces(root, files) {
  const pieces = [];
  for (const file of files) {
    const rel = relative(root, file);
    const parts = rel.split('/');
    const base = path.basename(file);
    const lower = base.toLowerCase();
    if (base === 'SKILL.md') {
      const frontmatter = parseFrontmatter(fs.readFileSync(file, 'utf8'));
      pieces.push(piece(root, file, 'skill', frontmatter.name || '', frontmatter.description || ''));
    }
    if (parts.length > 1 && parts.at(-2).toLowerCase() === 'agents' && lower.endsWith('.md')) pieces.push(piece(root, file, 'agent', path.basename(file, path.extname(file))));
    if (parts.length > 1 && parts.at(-2).toLowerCase() === 'commands' && lower.endsWith('.md')) pieces.push(piece(root, file, 'command', path.basename(file, path.extname(file))));
    const inHooksDir = parts.some((part) => part.toLowerCase() === 'hooks');
    const possibleHookJson = lower.endsWith('.json') && (inHooksDir || lower === 'hooks.json' || lower.endsWith('-hooks.json') || lower === 'settings.json');
    if (inHooksDir && !lower.endsWith('.json')) {
      pieces.push(piece(root, file, 'hook', path.basename(file)));
    } else if (possibleHookJson) {
      try {
        const json = JSON.parse(fs.readFileSync(file, 'utf8'));
        const hooks = json.hooks;
        if (inHooksDir || hooks && typeof hooks === 'object') {
          const eventNames = Object.keys(hooks || json).sort();
          pieces.push(piece(root, file, 'hook', eventNames.join(', ') || base));
        }
      } catch {
        if (inHooksDir || lower === 'hooks.json' || lower.endsWith('-hooks.json')) pieces.push(piece(root, file, 'hook', base));
      }
    }
    if (RULE_FILES.has(lower) || (parts.length > 1 && parts.at(-2).toLowerCase() === 'rules' && lower.endsWith('.md'))) pieces.push(piece(root, file, 'rule', base));
    if ((parts.some((part) => part.toLowerCase() === 'prompts') || /prompt.*\.(md|txt)$/i.test(base))) pieces.push(piece(root, file, 'prompt', base));
    if (lower === '.mcp.json' || lower === 'mcp.json') pieces.push(piece(root, file, 'mcp', base));
  }
  return pieces.sort((a, b) => a.path.localeCompare(b.path) || a.kind.localeCompare(b.kind) || a.name.localeCompare(b.name));
}

function zipCommit(file) {
  const output = execFileSync('unzip', ['-z', file], { encoding: 'utf8' });
  const comments = output.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !/^Archive:/i.test(line));
  if (comments.length !== 1 || !COMMIT_RE.test(comments[0])) throw new Error(`Expected one 40-character commit in zip comment: ${path.basename(file)}`);
  return comments[0].toLowerCase();
}

function zipMap(zipsDir, roots) {
  const zips = fs.readdirSync(zipsDir).filter((name) => name.toLowerCase().endsWith('.zip')).sort();
  const map = new Map();
  const usedZips = new Set();
  for (const root of roots) {
    const repo = path.basename(root).split('__').at(-1).toLowerCase();
    const candidates = zips.filter((name) => {
      const stem = name.replace(/\.zip$/i, '').replace(/ \(\d+\)$/, '').replace(/-(main|master|develop|dev)$/i, '').toLowerCase();
      return stem === repo;
    });
    if (candidates.length !== 1) throw new Error(`Expected one zip for ${path.basename(root)}, found ${candidates.length}`);
    if (usedZips.has(candidates[0])) throw new Error(`Zip maps to more than one upstream: ${candidates[0]}`);
    usedZips.add(candidates[0]);
    map.set(root, zipCommit(path.join(zipsDir, candidates[0])));
  }
  return map;
}

function directoryBytes(files) {
  const seen = new Set();
  let total = 0;
  for (const file of files) {
    const target = fs.realpathSync(file);
    if (!seen.has(target)) {
      seen.add(target);
      total += fs.statSync(target).size;
    }
  }
  return total;
}

function buildInventory(forkDir, zipsDir) {
  const roots = [];
  for (const category of fs.readdirSync(forkDir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (category.isSymbolicLink()) throw new Error(`Symlinked upstream category is not supported: ${category.name}`);
    if (!category.isDirectory() || category.name.startsWith('_')) continue;
    for (const repo of fs.readdirSync(path.join(forkDir, category.name), { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
      if (repo.isSymbolicLink()) throw new Error(`Symlinked upstream root is not supported: ${category.name}/${repo.name}`);
      if (repo.isDirectory()) roots.push({ root: path.join(forkDir, category.name, repo.name), category: category.name });
    }
  }
  const commits = zipMap(zipsDir, roots.map((item) => item.root));
  const upstreams = roots.map(({ root, category }) => {
    const files = walk(root);
    const licence = licenseInfo(files, root);
    return {
      id: path.basename(root),
      category,
      commit: commits.get(root),
      ...licence,
      sizeKb: Math.round(directoryBytes(files) / 1024 * 1000) / 1000,
      pieces: discoverPieces(root, files),
    };
  });
  return { generated: new Date().toISOString(), upstreams };
}

function main() {
  const { fork, zips, out } = parseArgs(process.argv.slice(2));
  for (const dir of [fork, zips]) if (!fs.statSync(dir).isDirectory()) throw new Error(`Not a directory: ${dir}`);
  const result = buildInventory(path.resolve(fork), path.resolve(zips));
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, `${JSON.stringify(result, null, 2)}\n`);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { buildInventory, discoverPieces, parseFrontmatter };
