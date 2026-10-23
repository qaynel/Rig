# testing.flaky-reliability.retry-hardening — floor and mutation-floor slice

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Policy grade slice `retry-hardening-slice-floor`: List the failure types that may be retried, such as network timeouts. Retrying everything hides real defects, so name transient causes only.
