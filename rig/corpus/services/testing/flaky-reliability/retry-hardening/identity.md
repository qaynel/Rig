# testing.flaky-reliability.retry-hardening — identity

Policy grade: retry hardening owns flaky-reliability.retry-hardening. Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Keep neighboring flaky-reliability services outside the retry hardening decision for flaky-reliability.retry-hardening. Start from the configured input at `rig-services/testing.flaky-reliability.retry-hardening.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Choose a repository-owned check that observes retry hardening from rig-services/testing.flaky-reliability.retry-hardening.json.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:minimal:retry-hardening-source-code-boundary.

Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array).
