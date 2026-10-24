# testing.flaky-reliability.retry-hardening — maximal

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade, maximal: Set retrying assertion failures to false. Repeating a failed assertion until it passes changes the test contract, so retry infrastructure errors only. Cumulative with minimal and mid. Binding checks: retry-hardening-source-code-boundary, retry-hardening-flaky-reliability-context, retry-hardening-evidence-receipt.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:maximal:retry-hardening-source-code-boundary+retry-hardening-flaky-reliability-context+retry-hardening-evidence-receipt.
Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array); retry-hardening-flaky-reliability-context: `maximum_attempts` is numeric and at least 3; retry-hardening-evidence-receipt: `retry_assertion_failures` equals false.
