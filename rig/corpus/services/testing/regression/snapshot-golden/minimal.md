# testing.regression.snapshot-golden — minimal

Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for snapshot golden. The minimal boundary for snapshot golden checks golden_paths (nonempty): golden paths must name the concrete repository contract. Binding checks: snapshot-golden-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe regression.snapshot-golden; bind it to the input named in `rig-services/testing.regression.snapshot-golden.json` and preserve the check's failure status. When adopting this in an existing repository, connect snapshot golden to the command that inspects golden_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.snapshot-golden as a failure.

Acceptance target: policy:testing.regression.snapshot-golden:minimal:snapshot-golden-source-code-boundary.

Declared predicates: snapshot-golden-source-code-boundary: `golden_paths` is nonempty (a string or array).
