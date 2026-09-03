#!/usr/bin/env node
// Version-consistency guard. Rig declares its version in seven files across
// five host ecosystems, and every release bumps all of them by hand.
//
// tests/gemini-extension.test.js already checks the four plugin manifests agree
// with each other, but that can't catch the failure mode that shipped in v4.8.0:
// every manifest stayed stale at 4.7.0 *together* while the release moved on, so
// they "agreed" and the test passed (#260, #262). It also ignores the two
// package.json files. This check closes both gaps:
//   1. every version-bearing file must share one pinned X.Y.Z version, and
//   2. on a release-tag CI run, that shared version must equal the tag.

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const root = path.join(__dirname, '..');
const PINNED_SEMVER = /^\d+\.\d+\.\d+$/;

// Every file that declares the project version, and who reads it. Add new host
// manifests here so a future ecosystem can't drift unnoticed.
const VERSION_FILES = [
  '.claude-plugin/plugin.json',  // Claude Code plugin — what users install
  '.codex-plugin/plugin.json',   // Codex plugin
  '.devin-plugin/plugin.json',   // Devin CLI plugin
  '.github/plugin/plugin.json',  // Copilot plugin
  'antigravity-plugin/plugin.json', // Antigravity plugin (Customizations / agy plugin)
  'gemini-extension.json',       // Gemini CLI extension
  'package.json',                // pi-package / repo root
  'rig-mcp/package.json',   // MCP server (private, internal-only)
];

function readVersion(relPath) {
  try {
    // Strip a UTF-8 BOM some Windows editors prepend (breaks JSON.parse).
    const raw = fs.readFileSync(path.join(root, relPath), 'utf8').replace(/^\uFEFF/, '');
    return JSON.parse(raw).version;
  } catch (e) {
    throw new Error(`${relPath}: ${e.message}`);
  }
}

let failed = false;
const versions = VERSION_FILES.map((relPath) => {
  const version = readVersion(relPath);
  if (typeof version !== 'string' || !PINNED_SEMVER.test(version)) {
    console.error(`${relPath}: version must be a pinned X.Y.Z semver, got ${JSON.stringify(version)}`);
    failed = true;
  }
  return [relPath, version];
});

// Every file must declare the same version.
const distinct = [...new Set(versions.map(([, v]) => v))];
if (distinct.length > 1) {
  console.error('Version mismatch — every manifest must share one version:');
  for (const [relPath, version] of versions) console.error(`  ${version}\t${relPath}`);
  failed = true;
}
const shared = distinct.length === 1 ? distinct[0] : null;

// On a release-tag push CI sets GITHUB_REF_TYPE=tag and GITHUB_REF_NAME=vX.Y.Z.
// The shared version must equal the tag — this catches tagging a release whose
// version files were never bumped, which mutual agreement alone cannot.
if (shared && process.env.GITHUB_REF_TYPE === 'tag') {
  const tag = process.env.GITHUB_REF_NAME || '';
  const tagVersion = tag.replace(/^v/, '');
  if (PINNED_SEMVER.test(tagVersion) && tagVersion !== shared) {
    console.error(`release tag ${tag} does not match version ${shared}; bump the version files before tagging`);
    failed = true;
  }
}

// Identity guard (RIG-117). A published manifest whose homepage/repository/author
// URL points at a dead repo sends every customer's "view source"/"report issue"
// click to the wrong place. The old repo was `vaibhav-kodiyan/agentic-harness-demo`;
// the real published repo is qaynel/Rig. Fail closed if the stale slug
// survives anywhere in the shipped manifests or the marketplace entry.
const STALE_IDENTITY = 'agentic-harness-demo';
const IDENTITY_FILES = [
  '.claude-plugin/plugin.json',
  '.codex-plugin/plugin.json',
  '.devin-plugin/plugin.json',
  '.github/plugin/plugin.json',
  'antigravity-plugin/plugin.json',
  'gemini-extension.json',
  '.agents/plugins/marketplace.json',
];
for (const relPath of IDENTITY_FILES) {
  let raw = '';
  try {
    raw = fs.readFileSync(path.join(root, relPath), 'utf8');
  } catch {
    continue; // a host that doesn't ship this manifest is fine
  }
  if (raw.includes(STALE_IDENTITY)) {
    console.error(`${relPath}: stale repository identity "${STALE_IDENTITY}" — point homepage/repository/author URLs at the real published repo (qaynel/Rig).`);
    failed = true;
  }
}

if (failed) {
  console.error('Align the version fields (see issue #260) so every manifest shares one version.');
  process.exit(1);
}

// Pre-v5 gate scripts (RIG-131, RIG-132 ratchet). Invoked here so they run
// before the Node test glob without editing the signed package.json scripts.
// `build-skill-catalog.js --check` joins them: the generated skill shelf is a
// committed artefact, so drift from its frontmatter sources is a gate failure.
for (const [rel, ...args] of [
  ['scripts/check-ticket-traceability.js'],
  ['scripts/check-raw-registry-access.js'],
  ['scripts/build-skill-catalog.js', '--check'],
]) {
  const result = spawnSync(process.execPath, [path.join(root, rel), ...args], {
    cwd: root,
    encoding: 'utf8',
    stdio: 'inherit',
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

console.log(`All ${VERSION_FILES.length} version files pinned at ${shared}; identity URLs clean across ${IDENTITY_FILES.length} manifests.`);
