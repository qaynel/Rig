# testing.regression.snapshot-golden — identity

Policy grade: snapshot golden owns regression.snapshot-golden. Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Keep neighboring regression services outside the snapshot golden decision for regression.snapshot-golden. Start from the configured input at `rig-services/testing.regression.snapshot-golden.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Choose a repository-owned check that observes snapshot golden from rig-services/testing.regression.snapshot-golden.json.

Acceptance target: policy:testing.regression.snapshot-golden:minimal:snapshot-golden-source-code-boundary.

Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array).
