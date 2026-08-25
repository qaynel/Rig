#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const RAW_FIELDS = [
  'mcp_config', 'surfaces', 'instruction', 'native_skill',
  'shell_hook', 'web_hook', 'mcp_hook',
];
const SOURCE_OWNER = 'lib/host-capabilities.js';

function parseArgs(argv) {
  const args = {
    root: path.join(__dirname, '..', 'rig'),
    inventory: path.join(__dirname, '..', 'rig', 'raw-registry-access.json'),
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === '--root') args.root = argv[++i];
    else if (argv[i] === '--inventory') args.inventory = argv[++i];
  }
  return args;
}

function listJs(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) listJs(abs, acc);
    else if (entry.name.endsWith('.js')) acc.push(abs);
  }
  return acc;
}

function fieldsRead(source) {
  if (!/require\([^)]*host-capabilities/.test(source)) return [];
  return RAW_FIELDS.filter((field) => new RegExp(`REGISTRY(?:\\s*\\[[^\\]]+\\]|\\s*\\.\\w+)?\\s*(?:\\.[\\w]+)?\\.${field}\\b|\\.${field}\\b`).test(source)
    && new RegExp(`REGISTRY[\\s\\S]{0,200}${field}`).test(source));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inventory = JSON.parse(fs.readFileSync(args.inventory, 'utf8'));
  const lib = path.join(args.root, 'lib');
  const found = new Map();
  for (const abs of listJs(lib)) {
    const rel = path.relative(args.root, abs).split(path.sep).join('/');
    if (rel === SOURCE_OWNER) continue;
    const source = fs.readFileSync(abs, 'utf8');
    if (!/require\([^)]*host-capabilities/.test(source) || !/\bREGISTRY\b/.test(source)) continue;
    const fields = RAW_FIELDS.filter((field) => (
      new RegExp(`REGISTRY[\\s\\S]{0,500}\\.${field}\\b`).test(source)
      || new RegExp(`\\bcaps\\.${field}\\b`).test(source)
    ));
    if (!fields.length) continue;
    found.set(rel, fields);
  }

  const violations = [];
  const allowed = new Map((inventory.readers || []).map((row) => [row.file, row.fields || []]));
  for (const [file, fields] of found.entries()) {
    const permitted = allowed.get(file);
    if (!permitted) {
      violations.push(`${file} reads ${fields.join(', ')}`);
      continue;
    }
    for (const field of fields) {
      if (!permitted.includes(field)) violations.push(`${file} reads ${field}`);
    }
  }
  for (const [file, fields] of allowed.entries()) {
    const abs = path.join(args.root, file);
    if (!fs.existsSync(abs)) {
      violations.push(`stale allowlist entry ${file}`);
      continue;
    }
    const present = found.get(file) || [];
    for (const field of fields) {
      if (!present.includes(field)) violations.push(`stale allowlist entry ${file} ${field}`);
    }
  }

  const count = (inventory.readers || []).length;
  if (found.size > count) violations.push(`raw registry debt increased to ${found.size}`);
  console.log(`raw registry debt: ${count}`);
  for (const violation of violations) console.log(violation);
  process.exit(violations.length ? 1 : 0);
}

main();
