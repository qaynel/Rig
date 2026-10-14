# testing.regression.snapshot-golden — identity

snapshot golden owns regression.snapshot-golden. Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.

Keep sibling services in regression under their own verdicts. Start from the configured input at `rig-services/testing.regression.snapshot-golden.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.snapshot-golden:policy-boundary. Given source-code is present and regression.snapshot-golden is selected, pass only when the repository binding evaluates regression.snapshot-golden and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern.
