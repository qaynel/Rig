'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write, read } = require('./_harness');

// F18 — change a documented behavior and file an owner decision.
const DECISION = 'Releases stop on a red test. No exceptions, including hotfixes.';

test('PT-038 stale docs block closeout', () => {
  const repo = tempRepo('rig-knowledge-');
  write(repo, 'src/release.js', 'exports.gate = () => "stop on red";\n');
  write(repo, 'docs/releasing.md', 'Releases continue when tests are red if the change is a hotfix.\n');
  const knowledge = capability('knowledge');

  const result = knowledge.closeout(repo, { changed: ['src/release.js'] });

  assert.equal(result.allowed, false);
  assert.ok(result.stale.some((s) => s.file === 'docs/releasing.md'), 'the contradicted user-facing page is named');
  assert.ok(result.stale[0].because, 'the finding says which change contradicts it');
});

test('PT-039 the owner text is intact and indexed by topic', () => {
  const repo = tempRepo('rig-knowledge-file-');
  write(repo, 'wiki/topics/releasing.md', '# Releasing\n');
  const knowledge = capability('knowledge');

  const filed = knowledge.fileDecision(repo, { text: DECISION, topics: ['releasing'], date: '2026-10-24' });

  assert.ok(read(repo, filed.path).includes(DECISION), 'the owner wording is stored verbatim');
  assert.ok(read(repo, 'wiki/topics/releasing.md').includes(filed.path), 'the subject hub reaches the decision');
  assert.ok(read(repo, filed.index).includes(filed.path), 'the decision index reaches it too');
  knowledge.fileDecision(repo, { text: `${DECISION} Amended.`, topics: ['releasing'], date: '2026-10-25' });
  assert.ok(read(repo, filed.path).includes(DECISION), 'an amendment never rewrites the earlier record');
});
