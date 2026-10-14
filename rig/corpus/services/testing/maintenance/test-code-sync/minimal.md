# testing.maintenance.test-code-sync — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for test code sync. It checks changed_behaviors (nonempty): changed behaviors must name the concrete repository contract.. Binding checks: test-code-sync-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe maintenance.test-code-sync; bind it to the input named in `rig-services/testing.maintenance.test-code-sync.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside maintenance.test-code-sync is a failure.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`.

Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed behaviors — ["owner is required"].

mid: updated cases — ["reject missing owner"].

maximal: tests follow output blindly — false.
