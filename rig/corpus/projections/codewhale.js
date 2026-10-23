// Pure projector for codewhale. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'codewhale', project: (h) => [h.ensureLine('AGENTS.md')] };
