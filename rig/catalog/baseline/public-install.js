'use strict';

// Public install: projects the one central Rig corpus into a repository through
// the existing payload machinery. Neutral layer only; repository capabilities
// and adaptation state are left to onboarding, so this never writes
// .rig/adaptation.json and never reports selected capabilities.

const fs = require('node:fs');
const { runPayload } = require('../../lib/payload');

function install(repo, options) {
  if (typeof repo !== 'string' || !fs.statSync(repo, { throwIfNoEntry: false })?.isDirectory()) {
    throw new Error(`rig: install target is not an existing directory: ${repo}`);
  }
  if (!options || options.archive !== 'public') {
    throw new Error('rig: install requires options.archive === "public"');
  }
  const { writes } = runPayload(repo, []);
  return { installed: true, repo, hosts: [], writes, adaptation: 'pending' };
}

module.exports = { install };
