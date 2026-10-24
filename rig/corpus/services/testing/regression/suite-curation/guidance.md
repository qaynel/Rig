# suite-curation

Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`. Input: `rig-services/testing.regression.suite-curation.json`.

Coverage ceiling: Configuration validation only, so it confirms retained suites, retirement reasons and the no-owner flag are declared; it does not run the suites.

minimal: retained suites — ["critical regression"]. List the suites kept because they guard live behavior. Without it nothing protects against removal, so name them.

mid: retirement reasons — ["obsolete API removed"]. Give a written reason for each retired test. Removal without a reason can reopen a defect, so record why it was safe.

maximal: remove without behavior owner — false. Set removing without a behavior owner to false. A test with no identified owner is deleted blindly, so name who owns the behavior first.
