# testing.regression.snapshot-golden — mid

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: snapshot-golden-source-code-boundary, snapshot-golden-regression-context.

Inspect the existing repository's snapshot golden convention, then name the source path or command that establishes it. For snapshot golden, inspect the repository's actual spec, source, test, or configuration for reviewed_diffs; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring regression services outside the snapshot golden decision for regression.snapshot-golden.

Acceptance target: policy:testing.regression.snapshot-golden:mid:snapshot-golden-source-code-boundary+snapshot-golden-regression-context.

Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array); snapshot-golden-regression-context: `reviewed_diffs` is nonempty (a string or array).
