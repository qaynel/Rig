'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

// Test authors supply the semantic judgment after reviewing their known fixture
// instructions. This only records that judgment against the actual current bytes;
// it does not infer consistency or grant a production review automatically.
function writeFixtureSemanticReview(target, { reason, documents } = {}) {
  if (typeof reason !== 'string' || !reason.trim()) throw new Error('fixture semantic review requires the author\'s concrete relationship judgment');
  const paths = documents || require('../../rig/lib/checks').contextHarnesses(target);
  const inputs = paths.map((rel) => ({ path: rel, digest: crypto.createHash('sha256').update(fs.readFileSync(path.join(target, rel))).digest('hex') }));
  const relationships = inputs.flatMap((from, index) => inputs.slice(index + 1).map((to) => ({ from: from.path, to: to.path, status: 'consistent', reason })));
  const index = { documents: paths.map((rel) => ({ path: rel })), review: {
    schema_version: 1, reviewer: { kind: 'host-agent', identity: 'reviewed-fixture-author' }, status: 'pass', inputs, relationships,
  } };
  const write = require('../../rig/lib/payload').journalWriter(target);
  write.begin();
  write(target, '.rig/context-index.json', `${JSON.stringify(index, null, 2)}\n`);
  write.finish();
  return index;
}
module.exports = { writeFixtureSemanticReview };
