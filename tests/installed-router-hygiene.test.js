#!/usr/bin/env node
'use strict';

// Oracle for RIG-151 / RIG-152 / RIG-124.2 (POLISH, pure-markdown).
//
// routing.md and tdd/SKILL.md install byte-identical into every target repo
// (no templating — proven by rig-bootstrap.test.js). So an assertion on the
// source file is an assertion on what every stranger repo receives. This file
// is also the first instance of the mechanical "breakage-count" lint RIG-153
// specifies: grep the installed instruction payload for defect shapes that
// need no model call to detect.
//
// Chosen fix: option B — reframe the phantom-convention passages as explicit
// instructions to the onboarding host agent, markdown-only. Not an install-time
// transform, not bare deletion. See
// wiki/reasoning/2026-08-31-routing-md-adaptation-not-transform.md.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const routing = read('rig/tier-1/routing.md');
const tddSources = [
  'rig/tier-1/skills/tdd/SKILL.md',
  '.claude/skills/rig-tdd/SKILL.md',
  '.agents/skills/rig-tdd/SKILL.md',
];

const bareTicketCitation = /\(RIG-\d+(?:\.\d+)?\)/;

test('RIG-124.2 — installed instruction text carries no dangling internal ticket citation', () => {
  assert.doesNotMatch(
    routing,
    bareTicketCitation,
    'rig/tier-1/routing.md ships into repos with no wiki/Tickets.md to resolve (RIG-NNN) against',
  );
  for (const rel of tddSources) {
    assert.doesNotMatch(read(rel), bareTicketCitation, `${rel} ships a bare (RIG-NNN) citation`);
    assert.match(read(rel), /right before push/i, `${rel} must drop only the citation, not the sentence`);
  }
});

test('RIG-151 — router asserts no wiki/status.md cadence the target repo does not have', () => {
  assert.doesNotMatch(
    routing,
    /every three minutes/i,
    'the rigid 3-minute cadence is Rig-dev doctrine; a fresh install has no wiki and no such convention',
  );
  assert.doesNotMatch(
    routing,
    /regenerate\s+`?wiki\/status\.md`?/i,
    'a stranger repo has no wiki/status.md to regenerate',
  );
  // Reframed, not deleted: the reasoning-trace practice is still named, now
  // scoped to the target repo's own convention / addressed to the onboarding agent.
  assert.match(routing, /reasoning trace/i, 'cadence guidance must be reframed for the onboarding agent, not dropped');
  assert.match(
    routing,
    /onboard|installing rig into|this rep(?:o|ository)'?s? (?:own )?convention|rig'?s own (?:development|dev)/i,
    'the reframed cadence must address the onboarding host agent or Rig-only dev use explicitly',
  );
});

test('RIG-152 — router hands the onboarding agent no never-true "source checkout" conditional', () => {
  assert.doesNotMatch(
    routing,
    /in this\s+source\s+checkout/i,
    'an installed copy is by definition not "this source checkout"; the conditional can never fire where it is read',
  );
  // Reframed, not deleted: contributor path guidance stays available where it is true.
  assert.match(
    routing,
    /rig\/tier-1\//,
    'the Rig-source path guidance must be retained (scoped for contributors), not removed',
  );
});

test('RIG-150 — rig.md implementation rule names the skill, not a raw .rig/ path', () => {
  const rigRule = read('rig/tier-1/rules/rig.md');
  assert.doesNotMatch(
    rigRule,
    /\.rig\/skills\/implementation\/SKILL\.md/,
    'hardcoded path is dead for claude/codex installs; use skill name instead',
  );
  assert.match(rigRule, /rig-implementation/, 'must reference the skill by name');
});
