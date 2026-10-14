# testing.flaky-reliability.retry-hardening — identity

retry hardening owns flaky-reliability.retry-hardening. Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Keep sibling services in flaky-reliability under their own verdicts. Start from the configured input at `rig-services/testing.flaky-reliability.retry-hardening.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:policy-boundary. Given source-code is present and flaky-reliability.retry-hardening is selected, pass only when the repository binding evaluates flaky-reliability.retry-hardening and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent flaky reliability concern.
