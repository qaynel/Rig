#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnGuardedSync } = require('./spawn-guarded');
const { journalWriter } = require('./payload');
const { containedPath } = require('./path-safety');
function setupMcp(target, { writeFile = null } = {}) {
  const runtime = containedPath(target, '.rig/runtime/rig-mcp');
  const stage = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-mcp-download-'));
  try {
    for (const file of ['package.json', 'package-lock.json']) fs.copyFileSync(path.join(runtime, file), path.join(stage, file));
    const installed = spawnGuardedSync('npm', ['ci', '--omit=dev', '--ignore-scripts', '--no-audit', '--no-fund', '--no-bin-links', '--prefix', '.'], { cwd: stage, encoding: 'utf8', timeout: 180000 });
    if (installed.status !== 0) throw new Error(`rig: npm ci failed for MCP runtime: ${installed.stderr || installed.stdout || installed.error}`);
    const writer = writeFile || journalWriter(target);
    function copy(dir, rel) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const src = path.join(dir, entry.name);
        const dest = `${rel}/${entry.name}`;
        if (entry.isDirectory()) copy(src, dest);
        else if (entry.isFile()) writer(target, dest, fs.readFileSync(src), fs.statSync(src).mode & 0o777);
        else if (entry.isSymbolicLink()) { /* .bin/ symlinks from npm; skipped because --no-bin-links is used in prod */ }
        else throw new Error(`rig: unsupported downloaded dependency entry ${entry.name}`);
      }
    }
    copy(path.join(stage, 'node_modules'), '.rig/runtime/rig-mcp/node_modules');
    writer(target, '.rig/mcp-server.json', JSON.stringify({ command: 'node', args: ['.rig/runtime/rig-mcp/index.js'] }, null, 2) + '\n');
    if (!writeFile) writer.finish();
  } finally { fs.rmSync(stage, { recursive: true, force: true }); }
}
module.exports = { setupMcp };
