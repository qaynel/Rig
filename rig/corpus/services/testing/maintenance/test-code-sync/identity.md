# testing.maintenance.test-code-sync — identity

Policy grade: test code sync owns maintenance.test-code-sync. Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Keep neighboring maintenance services outside the test code sync decision for maintenance.test-code-sync. Use the configured input at `rig-services/testing.maintenance.test-code-sync.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Choose a repository-owned check that observes test code sync from rig-services/testing.maintenance.test-code-sync.json.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.

Service-specific evidence cues:
Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.
minimal: changed behaviors — ["owner is required"].
mid: updated cases — ["reject missing owner"].
maximal: tests follow output blindly — false.
