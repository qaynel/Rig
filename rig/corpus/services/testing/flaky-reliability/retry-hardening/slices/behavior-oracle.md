# testing.flaky-reliability.retry-hardening — behavior-oracle slice

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade slice `retry-hardening-slice-behavior-oracle`: List the failure types that may be retried, such as network timeouts. Retrying everything hides real defects, so name transient causes only. Despite its name this slice is not a behavior oracle: it confirms retryable failures, an attempt cap and the retry-assertions flag are declared; it does not execute retries.
