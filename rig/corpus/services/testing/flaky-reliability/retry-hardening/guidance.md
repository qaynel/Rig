# retry-hardening

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Owned scope: `flaky-reliability.retry-hardening`. Input: `rig-services/testing.flaky-reliability.retry-hardening.json`.

Coverage ceiling: Configuration validation only, so it confirms retryable failures, an attempt cap and the retry-assertions flag are declared; it does not execute retries.

minimal: retryable failures — ["connection reset"]. List the failure types that may be retried, such as network timeouts. Retrying everything hides real defects, so name transient causes only.

mid: maximum attempts — 3. Cap attempts at a bounded number, at least 3 declared. An unbounded retry masks permanent failure, so set the limit.

maximal: retry assertion failures — false. Set retrying assertion failures to false. Repeating a failed assertion until it passes changes the test contract, so retry infrastructure errors only.
