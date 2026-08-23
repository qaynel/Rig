#!/usr/bin/env node
'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { runPayload } = require('../rig/lib/payload');
const { listVendoredSkills } = require('../rig/lib/skills');

function withTempTarget(fn) {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), 'rig-vendored-install-'));
  try { return fn(target); } finally { fs.rmSync(target, { recursive: true, force: true }); }
}

const vendored = listVendoredSkills();

test('vendored skills install under .claude/skills/rig-<name>/ with rewritten frontmatter and notice', () => {
  withTempTarget((target) => {
    runPayload(target, ['claude']);
    for (const skill of vendored) {
      const skillMd = path.join(target, '.claude', 'skills', `rig-${skill.name}`, 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), `missing ${skillMd}`);
      const body = fs.readFileSync(skillMd, 'utf8');
      assert.match(body, new RegExp(`^name: rig-${skill.name}\\s*$`, 'm'), `frontmatter name should be rig-${skill.name}`);
    }
    assert.ok(fs.existsSync(path.join(target, '.claude', 'skills', 'LICENSE.upstream')));
    assert.ok(fs.existsSync(path.join(target, '.claude', 'skills', 'UPSTREAM.md')));
  });
});

test('vendored skills install under .agents/skills/rig-<name>/ for codex hosts', () => {
  withTempTarget((target) => {
    runPayload(target, ['codex']);
    for (const skill of vendored) {
      const skillMd = path.join(target, '.agents', 'skills', `rig-${skill.name}`, 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), `missing ${skillMd}`);
      const body = fs.readFileSync(skillMd, 'utf8');
      assert.match(body, new RegExp(`^name: rig-${skill.name}\\s*$`, 'm'));
    }
    assert.ok(fs.existsSync(path.join(target, '.agents', 'skills', 'LICENSE.upstream')));
    assert.ok(fs.existsSync(path.join(target, '.agents', 'skills', 'UPSTREAM.md')));
  });
});

test('instruction-only hosts get the neutral .rig/skills/<name>/ layout with frontmatter matching the installed dir', () => {
  withTempTarget((target) => {
    runPayload(target, ['gemini']);
    for (const skill of vendored) {
      const skillMd = path.join(target, '.rig', 'skills', skill.name, 'SKILL.md');
      assert.ok(fs.existsSync(skillMd), `missing ${skillMd}`);
      const body = fs.readFileSync(skillMd, 'utf8');
      assert.match(body, new RegExp(`^name: ${skill.name}\\s*$`, 'm'), `neutral install preserves declared name for ${skill.name}`);
    }
    assert.ok(fs.existsSync(path.join(target, '.rig', 'skills', 'LICENSE.upstream')));
    assert.ok(fs.existsSync(path.join(target, '.rig', 'skills', 'UPSTREAM.md')));
    assert.ok(fs.existsSync(path.join(target, '.rig', 'skills', 'README.md')));
  });
});

test('plumbing tree lands under .rig/plumbing regardless of host', () => {
  withTempTarget((target) => {
    runPayload(target, ['claude']);
    assert.ok(fs.existsSync(path.join(target, '.rig', 'plumbing', 'bin')));
    assert.ok(fs.existsSync(path.join(target, '.rig', 'plumbing', 'lib')));
    const binEntries = fs.readdirSync(path.join(target, '.rig', 'plumbing', 'bin'));
    assert.ok(binEntries.length > 0, 'plumbing/bin must not be empty');
  });
});

test('vendored skill count and unique names match listVendoredSkills', () => {
  assert.equal(vendored.length, 55);
  assert.equal(new Set(vendored.map((s) => s.name)).size, 55);
});
