// Pure projector for cursor. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'cursor', project: (h) => [h.adapter('cursor', '.cursor/rules/rig.mdc')] };
