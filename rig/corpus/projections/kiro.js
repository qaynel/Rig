// Pure projector for kiro. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'kiro', project: (h) => [h.adapter('kiro', '.kiro/steering/rig.md')] };
