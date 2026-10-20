# testing.flaky-reliability.retry-hardening — identity

Policy grade: retry-hardening owns flaky-reliability.retry-hardening. Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Input: `rig-services/testing.flaky-reliability.retry-hardening.json`. Configuration validation only, so it confirms retryable failures, an attempt cap and the retry-assertions flag are declared; it does not execute retries.

Disposition: executable.
Acceptance target: policy:testing.flaky-reliability.retry-hardening:minimal:retry-hardening-source-code-boundary.
Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array).
