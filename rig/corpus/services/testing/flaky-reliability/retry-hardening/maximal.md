# testing.flaky-reliability.retry-hardening — maximal

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: retry-hardening-source-code-boundary, retry-hardening-flaky-reliability-context, retry-hardening-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:maximal:retry-hardening-source-code-boundary+retry-hardening-flaky-reliability-context+retry-hardening-evidence-receipt.

Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array); retry-hardening-flaky-reliability-context: `maximum_attempts` is numeric and at least 3; retry-hardening-evidence-receipt: `retry_assertion_failures` equals false.
