#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const { root, materialize, withRepo, exampleServer } = require('./helpers/basic-install');
const { validate } = require('../rig/lib/config');

const stdioOnly = {
  ...exampleServer,
  variants: [exampleServer.variants.find((variant) => variant.transport === 'stdio')],
};

function setupJson(target) {
  const note = fs.readFileSync(path.join(target, '.rig', 'mcp-setup.md'), 'utf8');
  const fenced = note.match(/```json\n([\s\S]*?)\n```/);
  assert.ok(fenced, 'onboarding includes one copy-pasteable JSON block');
  return { note, config: JSON.parse(fenced[1]) };
}

function verify(target, home) {
  return spawnSync(process.execPath, [
    path.join(root, 'rig', 'materialize.js'),
    'check', '--target', target, '--host', 'antigravity',
  ], { encoding: 'utf8', shell: false, env: { ...process.env, HOME: home } });
}

function verifyFromTargetCwd(target, home) {
  return spawnSync(process.execPath, [
    path.join(root, 'rig', 'materialize.js'),
    'check', '--host', 'antigravity',
  ], { cwd: target, encoding: 'utf8', shell: false, env: { ...process.env, HOME: home } });
}

test('Antigravity onboarding emits exact selected-server JSON and verification command', () => {
  withRepo((target) => {
    materialize(target, { hosts: ['antigravity'], mcp_servers: [stdioOnly] });
    const { note, config } = setupJson(target);

    assert.deepEqual(config, {
      mcpServers: {
        'example-db': {
          command: 'npx',
          args: ['-y', 'example-db-mcp'],
          env: { EXAMPLE_DB_TOKEN: '${EXAMPLE_DB_TOKEN}' },
        },
      },
    });
    assert.match(note, /~\/\.gemini\/config\/mcp_config\.json/);
    assert.match(note, /\.agents\/mcp_config\.json.*issue #60/i);
    assert.match(note, /\.rig\/bin\/rig check --host antigravity/);
  });
});

test('Antigravity host check verifies the exact global entries and fails visibly on drift', () => {
  withRepo((target) => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-antigravity-home-'));
    try {
      materialize(target, { hosts: ['antigravity'], mcp_servers: [stdioOnly] });
      const { config } = setupJson(target);
      const globalFile = path.join(home, '.gemini', 'config', 'mcp_config.json');
      fs.mkdirSync(path.dirname(globalFile), { recursive: true });
      fs.writeFileSync(globalFile, `${JSON.stringify(config, null, 2)}\n`);

      const clean = verify(target, home);
      assert.equal(clean.status, 0, clean.stderr);
      assert.match(clean.stdout, /"verified"\s*:\s*\[\s*"example-db"/);

      const expected = config.mcpServers['example-db'];
      config.mcpServers['example-db'] = { env: expected.env, args: expected.args, command: expected.command };
      fs.writeFileSync(globalFile, `${JSON.stringify(config, null, 2)}\n`);
      const reordered = verify(target, home);
      assert.equal(reordered.status, 0, reordered.stderr);

      config.mcpServers['example-db'].args.push('--changed');
      fs.writeFileSync(globalFile, `${JSON.stringify(config, null, 2)}\n`);
      const drifted = verify(target, home);
      assert.notEqual(drifted.status, 0);
      assert.match(drifted.stderr + drifted.stdout, /example-db.*does not match/i);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  });
});

test('Antigravity host check without a legacy receipt verifies a runnable rig server from the target cwd', () => {
  withRepo((target) => {
    const home = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-antigravity-home-'));
    try {
      const globalFile = path.join(home, '.gemini', 'config', 'mcp_config.json');
      fs.mkdirSync(path.dirname(globalFile), { recursive: true });
      fs.writeFileSync(globalFile, `${JSON.stringify({
        mcpServers: { rig: { command: 'node', args: ['/repo/.rig/runtime/rig-mcp/index.js'] } },
      }, null, 2)}\n`);

      const result = verifyFromTargetCwd(target, home);
      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /"verified"\s*:\s*\[\s*"rig"/);
    } finally {
      fs.rmSync(home, { recursive: true, force: true });
    }
  });
});

test('manual MCP entry names reject prototype-reserved object keys', () => {
  for (const name of ['__proto__', 'prototype', 'constructor']) {
    assert.throws(() => validate({
      hosts: ['antigravity'],
      mcp_servers: [{ ...stdioOnly, name }],
    }), /server name/i);
  }
});
