# testing.flaky-reliability.retry-hardening — minimal

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade, minimal: List the failure types that may be retried, such as network timeouts. Retrying everything hides real defects, so name transient causes only. Binding checks: retry-hardening-source-code-boundary.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:minimal:retry-hardening-source-code-boundary.
Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array).
