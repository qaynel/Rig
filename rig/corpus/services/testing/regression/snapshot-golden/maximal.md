# testing.regression.snapshot-golden — maximal

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade, maximal: Set automatic snapshot acceptance to false. Updating snapshots blindly makes output its own expectation, so require a human decision. Cumulative with minimal and mid. Binding checks: snapshot-golden-source-code-boundary, snapshot-golden-regression-context, snapshot-golden-evidence-receipt.

Acceptance target: policy:testing.regression.snapshot-golden:maximal:snapshot-golden-source-code-boundary+snapshot-golden-regression-context+snapshot-golden-evidence-receipt.
Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array); snapshot-golden-regression-context: `reviewed_diffs` is nonempty (a string or array); snapshot-golden-evidence-receipt: `automatic_snapshot_acceptance` equals false.
