# testing.flaky-reliability.retry-hardening — minimal

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for retry hardening. The minimal boundary for retry hardening checks retryable_failures (nonempty): retryable failures must name the concrete repository contract. Binding checks: retry-hardening-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe flaky-reliability.retry-hardening; bind it to the input named in `rig-services/testing.flaky-reliability.retry-hardening.json` and preserve the check's failure status. When adopting this in an existing repository, connect retry hardening to the command that inspects retryable_failures and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside flaky-reliability.retry-hardening as a failure.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:minimal:retry-hardening-source-code-boundary.

Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array).
