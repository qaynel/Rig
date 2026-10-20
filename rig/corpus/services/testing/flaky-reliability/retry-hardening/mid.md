# testing.flaky-reliability.retry-hardening — mid

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: retry-hardening-source-code-boundary, retry-hardening-flaky-reliability-context.

Inspect the existing repository's retry hardening convention, then name the source path or command that establishes it. For retry hardening, inspect the repository's actual spec, source, test, or configuration for maximum_attempts; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring flaky-reliability services outside the retry hardening decision for flaky-reliability.retry-hardening.

Acceptance target: policy:testing.flaky-reliability.retry-hardening:mid:retry-hardening-source-code-boundary+retry-hardening-flaky-reliability-context.

Declared predicates: retry-hardening-source-code-boundary: `retryable_failures` is nonempty (a string or array); retry-hardening-flaky-reliability-context: `maximum_attempts` is numeric and at least 3.
