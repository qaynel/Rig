# snapshot-golden

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Owned scope: `regression.snapshot-golden`. Input: `rig-services/testing.regression.snapshot-golden.json`.

Coverage ceiling: Configuration validation only, so it confirms golden paths, reviewed diffs and the auto-accept flag are declared; it does not compare snapshots.

minimal: golden paths — ["fixtures/order.json"]. List the golden files under test. Unlisted snapshots drift unnoticed, so name each path.

mid: reviewed diffs — ["field addition"]. Record the diffs reviewed against intended behavior. An unreviewed update accepts the implementation as truth, so cite the review.

maximal: automatic snapshot acceptance — false. Set automatic snapshot acceptance to false. Updating snapshots blindly makes output its own expectation, so require a human decision.
