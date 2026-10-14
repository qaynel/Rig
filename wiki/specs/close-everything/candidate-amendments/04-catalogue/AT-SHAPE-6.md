# Subplan 04 candidate amendments — catalogue

**Status: CANDIDATE, unsigned.** Prepared 2026-10-14 under the close-everything
plan ([catalogue services](../../04-catalogue-services.md)). Frozen files under
`wiki/gate1/` and tests pinned in
`wiki/gate1/testing-infrastructure.manifest` were not edited. The owner applies
this change in the single batched re-sign; agents never sign.

## AT-SHAPE-6 — assert authored guidance instead of required boilerplate

- File: `tests/advanced-oracle.test.js` (pinned), case
  `AT-SHAPE-6 all 115 leaves are authored at their declared grade`.
- Why: service guidance now states ownership, acceptance cues, adoption evidence,
  failure conditions, and coverage ceilings using each service's own fields.
  The old assertion required every fragment to contain the phrase
  `generic baseline`, which contradicts the current corpus authoring rule.
  The production `authorshipReport()` now rejects known boilerplate and bodies
  sharing more than 80% of their normalized eight-character shingles with a
  different service; it reports zero failures for the 115 current services.
- Proposed diff:

```diff
--- a/tests/advanced-oracle.test.js
+++ b/tests/advanced-oracle.test.js
@@ test('AT-SHAPE-6 all 115 leaves are authored at their declared grade', () => {
   const report = api('catalog.js', 'authorshipReport')();
   assert.deepEqual(report.counts, { development: 26, testing: 40, infrastructure: 31, 'product-security': 18 });
   assert.equal(report.services.length, 115);
   assert.deepEqual(report.failures, []);
   for (const { service, file } of allServiceFiles()) {
     const text = fs.readFileSync(file, 'utf8');
     if (service.id !== 'development.code-quality.lint-format') {
       assert.match(text, /Policy(?:-| )grade/i, file);
-      assert.match(text, /generic baseline|not repository-tailored|not tailored/i, file);
+      assert.doesNotMatch(text, /generic baseline|not repository-tailored|not tailored/i, file);
     }
     assert.doesNotMatch(text, /TODO|TBD|Concrete convention/i, file);
   }
 });
```

- Local evidence: `authorshipReport()` reports 115 services and zero failures;
  `node --test tests/advanced-catalogue.test.js` exercises boilerplate and
  near-duplicate rejection (6 pass). The pinned oracle remains untouched.
