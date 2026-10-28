'use strict';

const test = require('node:test');
const { assert, capability, tempRepo, write } = require('./_harness');

// F04 — recorded owner idea with two observable outcomes and one implementation
// suggestion.
const IDEA = [
  'When I ask for a release I want the build to stop if the tests are red,',
  'and I want to see which test failed.',
  'Probably easiest if you just shell out to jq for that.',
].join(' ');

test('PT-006 requirement draft links to the originating utterance', () => {
  const repo = tempRepo();
  const source = write(repo, 'notes/owner-2026-10-24.md', IDEA);
  const discovery = capability('discovery');

  const draft = discovery.extract(repo, { source: 'notes/owner-2026-10-24.md' });

  assert.ok(draft.requirements.length >= 2, 'two observable outcomes must yield at least two requirements');
  for (const req of draft.requirements) {
    assert.equal(req.source.file, 'notes/owner-2026-10-24.md');
    assert.ok(req.source.quote && IDEA.includes(req.source.quote), 'each requirement must quote the owner verbatim');
  }
  assert.ok(source);
});

test('PT-007 requirement draft has no unapproved design mandate', () => {
  const repo = tempRepo();
  write(repo, 'notes/owner-2026-10-24.md', IDEA);
  const discovery = capability('discovery');

  const draft = discovery.extract(repo, { source: 'notes/owner-2026-10-24.md' });

  for (const req of draft.requirements) {
    assert.doesNotMatch(req.statement, /\bjq\b|shell out/i, 'an implementation suggestion is not a requirement');
  }
  const suggestion = draft.suggestions.find((s) => /jq/i.test(s.text));
  assert.ok(suggestion, 'the implementation suggestion must be preserved, separated from the obligations');
  assert.equal(suggestion.approved, false);
});

// F05 — cold restart with one settled answer and one genuinely ambiguous
// product behavior.
test('PT-008 settled answers are not re-asked and material ambiguity is surfaced', () => {
  const repo = tempRepo();
  write(repo, '.rig/decisions.json', {
    settled: [{ id: 'D1', question: 'Does a red test block release?', answer: 'Yes, always.' }],
  });
  write(repo, 'notes/owner-2026-10-24.md', `${IDEA} Failures older than a week may be different.`);
  const discovery = capability('discovery');

  const questions = discovery.openQuestions(repo, { source: 'notes/owner-2026-10-24.md' });

  assert.equal(questions.filter((q) => /red test block release/i.test(q.question)).length, 0, 'a settled decision must not be re-asked');
  assert.equal(questions.length, 1, 'exactly the one genuinely ambiguous behavior is surfaced');
  assert.match(questions[0].question, /older than a week|stale/i);
  assert.ok(questions[0].affects_observable_behavior, 'only behavior-affecting ambiguity is worth the owner’s time');
});
