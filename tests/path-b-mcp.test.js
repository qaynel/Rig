'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const h = require('./helpers/path-b');

test('AT-PB-5 MCP exposes the same four-action schema with conservative annotations', async () => {
  const server = path.join(h.root, 'rig-mcp/index.js');
  assert.match(fs.readFileSync(server, 'utf8'), /rig_onboarding/, 'root MCP has no Path B tool registration');
  await h.withMcpClient(server, async (client) => {
    const tools = await client.listTools();
    const onboarding = tools.tools.find(({ name }) => name === 'rig_onboarding');
    assert.ok(onboarding, 'rig_onboarding is not registered');
    assert.deepEqual(onboarding.annotations, {
      readOnlyHint: false,
      destructiveHint: true,
      idempotentHint: true,
      openWorldHint: false,
    });
    const schemaText = JSON.stringify(onboarding.inputSchema);
    for (const action of ['prepare', 'propose', 'apply', 'check']) assert.match(schemaText, new RegExp(`"${action}"`));
    assert.ok(onboarding.outputSchema, 'rig_onboarding must publish its structured output schema');
  });
});

test('AT-PB-5 domain CLI and root/installed MCP return behaviorally identical responses', async () => {
  await h.withRepo(async (target) => {
    const rootServer = path.join(h.root, 'rig-mcp/index.js');
    assert.match(fs.readFileSync(rootServer, 'utf8'), /rig_onboarding/);
    const installedServer = path.join(target, '.rig/runtime/rig-mcp/index.js');
    assert.match(fs.readFileSync(installedServer, 'utf8'), /rig_onboarding/);
    const installedModules = path.join(target, '.rig/runtime/rig-mcp/node_modules');
    fs.symlinkSync(path.join(h.root, 'rig-mcp/node_modules'), installedModules, 'dir');
    const request = { schema_version: 1, action: 'prepare', target };
    const direct = h.handle(request);
    const rootResult = await h.withMcpClient(rootServer, (client) => client.callTool({ name: 'rig_onboarding', arguments: request }));
    const installedResult = await h.withMcpClient(installedServer, (client) => client.callTool({ name: 'rig_onboarding', arguments: request }));
    assert.deepEqual(rootResult.structuredContent, direct);
    assert.deepEqual(installedResult.structuredContent, direct);
    assert.deepEqual(rootResult.structuredContent, installedResult.structuredContent);
    assert.match(rootResult.content[0].text, /inspect-repository/);
  }, { install: true });
});

test('AT-PB-5 listing the onboarding tool never auto-runs preparation', async () => {
  await h.withRepo(async (target) => {
    const state = path.join(target, '.rig/state.json');
    assert.equal(fs.existsSync(state), false);
    await h.withMcpClient(path.join(h.root, 'rig-mcp/index.js'), async (client) => {
      const tools = await client.listTools();
      assert.ok(tools.tools.some(({ name }) => name === 'rig_onboarding'));
      assert.equal(fs.existsSync(state), false);
    });
  }, { install: true });
});

test('AT-PB-9 every installed adapter resolves to one router and one onboarding playbook', async () => {
  await h.withRepo((target) => {
    const router = path.join(target, '.rig/routing.md');
    const playbook = path.join(target, '.rig/skills/onboarding/SKILL.md');
    assert.equal(fs.existsSync(router), true);
    assert.equal(fs.existsSync(playbook), true);
    const routerText = fs.readFileSync(router, 'utf8');
    const playbookText = fs.readFileSync(playbook, 'utf8');
    assert.match(routerText, /Grilling[\s\S]*Business Specifications[\s\S]*Acceptance Criteria[\s\S]*Tests[\s\S]*Technical Specifications[\s\S]*LOCK[\s\S]*Test-Driven Development[\s\S]*Verification/i);
    assert.match(playbookText, /Understand[\s\S]*Discover[\s\S]*Catalogue-read[\s\S]*Delta[\s\S]*Propose[\s\S]*Summarise[\s\S]*Apply on approval/);

    const adapters = [
      path.join(target, '.agents/rules/rig.md'),
      path.join(target, 'CLAUDE.md'),
    ];
    for (const adapter of adapters) {
      assert.equal(fs.existsSync(adapter), true, `missing host adapter ${path.relative(target, adapter)}`);
      const body = fs.readFileSync(adapter, 'utf8');
      assert.match(body, /\.rig\/routing\.md/);
      assert.doesNotMatch(body, /Business Specifications[\s\S]*Acceptance Criteria[\s\S]*Technical Specifications/i);
    }
    const wrappers = [
      path.join(target, '.agents/skills/rig-onboarding/SKILL.md'),
      path.join(target, '.claude/skills/rig-onboarding/SKILL.md'),
    ];
    for (const wrapper of wrappers) {
      assert.equal(fs.existsSync(wrapper), true, `missing host wrapper ${path.relative(target, wrapper)}`);
      const wrapperText = fs.readFileSync(wrapper, 'utf8');
      assert.match(wrapperText, /\.rig\/skills\/onboarding\/SKILL\.md/);
      assert.doesNotMatch(wrapperText, /Catalogue-read[\s\S]*Apply on approval/);
    }

    const instructionFiles = h.walk(target).filter((file) =>
      !file.includes(`${path.sep}.rig${path.sep}runtime${path.sep}`) && /(?:\.md|\.mdc|SKILL\.md)$/.test(file));
    assert.equal(instructionFiles.filter((file) => /Business Specifications[\s\S]*Acceptance Criteria[\s\S]*Technical Specifications/i.test(fs.readFileSync(file, 'utf8'))).length, 1);
    assert.equal(instructionFiles.filter((file) => /Catalogue-read[\s\S]*Apply on approval/.test(fs.readFileSync(file, 'utf8'))).length, 1);

    for (const file of [...adapters, ...wrappers]) {
      for (const match of fs.readFileSync(file, 'utf8').matchAll(/`(\.rig\/[^`]+)`/g)) {
        assert.equal(fs.existsSync(path.join(target, match[1])), true, `${path.relative(target, file)} -> ${match[1]}`);
      }
    }
  }, { install: true, hosts: ['codex', 'claude'] });
});

test('AT-PB-9 domain and MCP load the installed canonical playbook bytes', async () => {
  await h.withRepo(async (target) => {
    const playbook = fs.readFileSync(path.join(target, '.rig/skills/onboarding/SKILL.md'), 'utf8');
    const direct = h.handle({ schema_version: 1, action: 'prepare', target });
    assert.equal(direct.context.playbook, playbook);
    const server = path.join(target, '.rig/runtime/rig-mcp/index.js');
    assert.match(fs.readFileSync(server, 'utf8'), /rig_onboarding/);
    fs.symlinkSync(path.join(h.root, 'rig-mcp/node_modules'), path.join(target, '.rig/runtime/rig-mcp/node_modules'), 'dir');
    const result = await h.withMcpClient(server, (client) => client.callTool({
      name: 'rig_onboarding',
      arguments: { schema_version: 1, action: 'prepare', target },
    }));
    assert.equal(result.structuredContent.context.playbook, playbook);
  }, { install: true });
});
