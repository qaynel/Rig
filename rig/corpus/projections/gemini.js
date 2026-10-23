// Pure projector for gemini. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'gemini', project: (h) => [h.ensureLine('GEMINI.md')] };
