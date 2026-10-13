// Pure projector for copilot. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'copilot', project: (h) => [h.ensureLine('.github/copilot-instructions.md')] };
