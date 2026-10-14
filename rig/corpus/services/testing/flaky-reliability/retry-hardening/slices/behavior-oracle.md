# testing.flaky-reliability.retry-hardening — behavior-oracle slice

Policy grade slice. This slice bounds retry hardening to flaky-reliability.retry-hardening. It uses `retry-hardening-slice-behavior-oracle` and checks retryable_failures (nonempty): retryable failures must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.flaky-reliability.retry-hardening.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Owned scope: `flaky-reliability.retry-hardening`.

Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Input: `rig-services/testing.flaky-reliability.retry-hardening.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

minimal: retryable failures — ["connection reset"].

mid: maximum attempts — 3.

maximal: retry assertion failures — false.
