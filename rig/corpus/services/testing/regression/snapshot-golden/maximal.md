# testing.regression.snapshot-golden — maximal

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: snapshot-golden-source-code-boundary, snapshot-golden-regression-context, snapshot-golden-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.regression.snapshot-golden:maximal:snapshot-golden-source-code-boundary+snapshot-golden-regression-context+snapshot-golden-evidence-receipt.

Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array); snapshot-golden-regression-context: `reviewed_diffs` is nonempty (a string or array); snapshot-golden-evidence-receipt: `automatic_snapshot_acceptance` equals false.
