// The .agents tree Codex and Antigravity both read. Pure: no I/O, no network.
'use strict';

module.exports = function agentsTree(h) {
  return [
    ...h.nativeSkills('.agents/skills'),
    h.adapter('pointer', '.agents/rules/rig.md'),
    h.ensureLine('AGENTS.md'),
  ];
};
