# testing.regression.snapshot-golden — minimal

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Policy grade, minimal: List the golden files under test. Unlisted snapshots drift unnoticed, so name each path. Binding checks: snapshot-golden-source-code-boundary.

Acceptance target: policy:testing.regression.snapshot-golden:minimal:snapshot-golden-source-code-boundary.
Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array).
