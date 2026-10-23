# testing.regression.snapshot-golden — identity

Policy grade: snapshot-golden owns regression.snapshot-golden. Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Input: `rig-services/testing.regression.snapshot-golden.json`. Configuration validation only, so it confirms golden paths, reviewed diffs and the auto-accept flag are declared; it does not compare snapshots.

Disposition: executable.
Acceptance target: policy:testing.regression.snapshot-golden:minimal:snapshot-golden-source-code-boundary.
Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array).
