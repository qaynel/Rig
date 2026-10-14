# testing.maintenance.dead-test-pruning — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dead test pruning. It checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract.. Binding checks: dead-test-pruning-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe maintenance.dead-test-pruning; bind it to the input named in `rig-services/testing.maintenance.dead-test-pruning.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside maintenance.dead-test-pruning is a failure.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:policy-boundary. Given source-code is present and maintenance.dead-test-pruning is selected, pass only when the repository binding evaluates maintenance.dead-test-pruning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Owned scope: `maintenance.dead-test-pruning`.

Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Input: `rig-services/testing.maintenance.dead-test-pruning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Select an approved repository-owned command to verify that behavior.

minimal: obsolete cases — ["removed legacy endpoint"].

mid: replacement evidence — ["new endpoint contract passes"].

maximal: delete live regressions — false.
