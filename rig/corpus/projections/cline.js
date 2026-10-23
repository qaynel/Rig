// Pure projector for cline. No I/O, no network: it only maps the corpus snapshot to entries.
'use strict';

module.exports = { host: 'cline', project: (h) => [h.adapter('cline', '.clinerules/rig.md')] };
