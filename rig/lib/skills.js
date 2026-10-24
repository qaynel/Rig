'use strict';

const { loadOptionalSkills } = require('./skill-catalog');

// The optional vendored shelf, read recursively from the capability hierarchy
// `rig/catalog/skills/<family>/<capability-leaf>/<source-dir>/SKILL.md`.
// The invocation name comes from frontmatter, never from the source path.
function listVendoredSkills() {
  return loadOptionalSkills().map(({
    name, dir, source_rel: sourceRel, family, tool, capability, guarantees, overlap_tags: overlapTags,
  }) => ({
    name, dir, source_rel: sourceRel, family, tool, capability, guarantees, overlap_tags: overlapTags,
  }));
}

module.exports = { listVendoredSkills };
