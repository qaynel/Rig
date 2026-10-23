# testing.flaky-reliability.retry-hardening — mid

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade, mid: Cap attempts at a bounded number, at least 3 declared. An unbounded retry masks permanent failure, so set the limit. Cumulative with minimal. Binding checks: retry-hardening-source-code-boundary, retry-hardening-flaky-reliability-context.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:mid:retry-hardening-source-code-boundary+retry-hardening-flaky-reliability-context.
Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array); retry-hardening-flaky-reliability-context: `maximum_attempts` is numeric and at least 3.
