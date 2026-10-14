# testing.regression.suite-curation — identity

suite curation owns regression.suite-curation. Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Keep sibling services in regression under their own verdicts. Read the configured input at `rig-services/testing.regression.suite-curation.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.suite-curation:policy-boundary. Given source-code is present and regression.suite-curation is selected, pass only when the repository binding evaluates regression.suite-curation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern.
