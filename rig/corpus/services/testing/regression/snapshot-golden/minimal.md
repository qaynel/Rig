# testing.regression.snapshot-golden — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for snapshot golden. The minimal boundary for snapshot golden checks golden_paths (nonempty): golden paths must name the concrete repository contract.. Binding checks: snapshot-golden-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe regression.snapshot-golden; bind it to the input named in `rig-services/testing.regression.snapshot-golden.json` and preserve the check's failure status. When adopting this in an existing repository, connect snapshot golden to the command that inspects golden_paths and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside regression.snapshot-golden as a failure.

Acceptance target: fixture:testing.regression.snapshot-golden:policy-boundary. Given source-code is present and regression.snapshot-golden is selected, pass only when the repository binding evaluates regression.snapshot-golden and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. The ceiling is snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Choose a repository-owned check that observes snapshot golden from rig-services/testing.regression.snapshot-golden.json..

Service-specific evidence cues:
Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.
minimal: golden paths — ["fixtures/order.json"].
mid: reviewed diffs — ["field addition"].
maximal: automatic snapshot acceptance — false.
