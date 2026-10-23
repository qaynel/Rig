// Pure projector for antigravity. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

const agentsTree = require('./_agents');

module.exports = {
  host: 'antigravity',
  project: (h) => [...agentsTree(h), ...h.workflows(), h.ensureLine('GEMINI.md')],
};
