'use strict';

const { createHash } = require('node:crypto');

// Exact, hash-bound inert documentation placeholders. Only listed spans are
// masked; every neighboring byte and line remains subject to the secret floor.
const SOURCE_PLACEHOLDERS = new Map([
  ['rig/upstreams/garrytan__gstack/document-generate/SKILL.md', ['4fdf8ad11cadfe955bde27ef9fffa333db57a5188e7728ef086a62f7c36a5f6b', [['AKIAIOSFODNN7', 'EXAMPLE'].join('')]]],
  ['rig/upstreams/garrytan__gstack/document-generate/SKILL.md.tmpl', ['81392cc551346b6de1a96c10e83936a4f126e6cb00812572e56e2642f3791f07', [['AKIAIOSFODNN7', 'EXAMPLE'].join('')]]],
  ['rig/upstreams/ruvnet__ruflo/plugin/skills/github-release-management/SKILL.md', ['b830dcc8111b453e4a908226be1a4727c02473ce0a3498e16a507bf62322e8ba', [['_auth', 'Token=${{ secrets.', 'NPM_TOKEN }}'].join('')]]],
  ['rig/upstreams/ruvnet__ruflo/.agents/skills/github-release-management/SKILL.md', ['caf4cb036725ef53f94f80f4cf578eec951d22d2f5bb4a88245bdab0a800d656', [['_auth', 'Token=${{ secrets.', 'NPM_TOKEN }}'].join('')]]],
  ['rig/upstreams/ruvnet__ruflo/.claude/skills/github-release-management/SKILL.md', ['b830dcc8111b453e4a908226be1a4727c02473ce0a3498e16a507bf62322e8ba', [['_auth', 'Token=${{ secrets.', 'NPM_TOKEN }}'].join('')]]],
  ['rig/upstreams/ruvnet__ruflo/v3/@claude-flow/cli/.claude/skills/github-release-management/SKILL.md', ['1ad25a778dd42ba3b9ecf0c59ceaeb62a49066048153cc8db45292dc5f738ce0', [['_auth', 'Token=${{ secrets.', 'NPM_TOKEN }}'].join('')]]],
  ['rig/upstreams/ruvnet__ruflo/CLAUDE.md', ['d6327d6283402acf150780ce212aac5d9283b8d4bbe321e3cc68e7c2f1b10b7d', [['_auth', 'Token=%s'].join('')]]],
  ['rig/upstreams/OpenHands__software-agent-sdk/.agents/skills/verify-agent-server/references/feature-map/F20-llm-profiles.md', ['e2e0375904d6a238d4e7cbcecc88e84320cdfe81620fb6581f71ee06e76271e6', [['sk-', 'qa-f20-not-stored'].join(''), ['sk-', 'qa-f20-invalid-key'].join(''), ['sk-', 'qa-f20-plain-key'].join('')]]],
  ['rig/upstreams/OpenHands__software-agent-sdk/.agents/skills/verify-agent-server/references/feature-map/F23-llm-catalog-and-connections.md', ['7e43f9e84b8ec519c4bdda5c3db4eb07991efc26efc54926eb17c3a87e926f9f', [['sk-', 'qa-f23-plain-key'].join(''), ['sk-', 'qa-f23-rotated-QA23'].join('')]]],
]);

function maskSourcePlaceholders(rel, content, line) {
  const normalized = rel.startsWith('.rig/kit/rig/') ? rel.slice('.rig/kit/'.length) : rel;
  const entry = SOURCE_PLACEHOLDERS.get(normalized);
  if (!entry || createHash('sha256').update(content).digest('hex') !== entry[0]) return line;
  return entry[1].reduce((text, placeholder) => text.split(placeholder).join('RIG_INERT_TEMPLATE_PLACEHOLDER'), line);
}

module.exports = { SOURCE_PLACEHOLDERS, maskSourcePlaceholders };
