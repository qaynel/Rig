# testing.regression.snapshot-golden — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for snapshot golden. It checks golden_paths (nonempty): golden paths must name the concrete repository contract.. Binding checks: snapshot-golden-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe regression.snapshot-golden; bind it to the input named in `rig-services/testing.regression.snapshot-golden.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside regression.snapshot-golden is a failure.

Acceptance target: fixture:testing.regression.snapshot-golden:policy-boundary. Given source-code is present and regression.snapshot-golden is selected, pass only when the repository binding evaluates regression.snapshot-golden and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Owned scope: `regression.snapshot-golden`.

Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Input: `rig-services/testing.regression.snapshot-golden.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

minimal: golden paths — ["fixtures/order.json"].

mid: reviewed diffs — ["field addition"].

maximal: automatic snapshot acceptance — false.
