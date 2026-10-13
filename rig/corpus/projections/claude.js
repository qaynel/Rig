// Pure projector for claude. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = {
  host: 'claude',
  project: (h) => [
    ...h.nativeSkills('.claude/skills'),
    h.ensureLine('CLAUDE.md'),
    ...h.vendored('.claude/skills/{name}', 'rig-'),
    ...h.licenseFiles('.claude/skills'),
  ],
};
