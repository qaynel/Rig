# testing.maintenance.test-code-sync — identity

test code sync owns maintenance.test-code-sync. Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Keep sibling services in maintenance under their own verdicts. Use the configured input at `rig-services/testing.maintenance.test-code-sync.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.test-code-sync:policy-boundary. Given source-code is present and maintenance.test-code-sync is selected, pass only when the repository binding evaluates maintenance.test-code-sync and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.
