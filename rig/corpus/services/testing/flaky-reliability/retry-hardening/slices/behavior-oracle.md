# testing.flaky-reliability.retry-hardening — behavior-oracle slice

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade slice. This slice bounds retry hardening to flaky-reliability.retry-hardening. It uses `retry-hardening-slice-behavior-oracle` and checks retryable_failures (nonempty): retryable failures must name the concrete repository contract.