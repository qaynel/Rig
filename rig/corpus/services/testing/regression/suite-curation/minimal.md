# testing.regression.suite-curation — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for suite curation. It checks retained_suites (nonempty): retained suites must name the concrete repository contract.. Binding checks: suite-curation-source-code-boundary.

Use a repository-owned command or existing native check that can observe regression.suite-curation; bind it to the input named in `rig-services/testing.regression.suite-curation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside regression.suite-curation is a failure.

Acceptance target: fixture:testing.regression.suite-curation:policy-boundary. Given source-code is present and regression.suite-curation is selected, pass only when the repository binding evaluates regression.suite-curation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent regression concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Owned scope: `regression.suite-curation`.

Offer: Keep the regressions that protect live behavior and give obsolete tests a written retirement reason. Removing a slow test without identifying its behavior owner can silently reopen a defect.

Input: `rig-services/testing.regression.suite-curation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: suite curation configuration validation only; declared policy does not prove running suite curation behavior. Select an approved repository-owned command to verify that behavior.

minimal: retained suites — ["critical regression"].

mid: retirement reasons — ["obsolete API removed"].

maximal: remove without behavior owner — false.
