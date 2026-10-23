// Pure projector for windsurf. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'windsurf', project: (h) => [h.adapter('windsurf', '.windsurf/rules/rig.md')] };
