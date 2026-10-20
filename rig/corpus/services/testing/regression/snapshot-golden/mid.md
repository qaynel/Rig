# testing.regression.snapshot-golden — mid

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade, mid: Record the diffs reviewed against intended behavior. An unreviewed update accepts the implementation as truth, so cite the review. Cumulative with minimal. Binding checks: snapshot-golden-source-code-boundary, snapshot-golden-regression-context.

Acceptance target: policy:testing.regression.snapshot-golden:mid:snapshot-golden-source-code-boundary+snapshot-golden-regression-context.
Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array); snapshot-golden-regression-context: `reviewed_diffs` is nonempty (a string or array).
