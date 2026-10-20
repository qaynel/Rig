# retry hardening

Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Owned scope: `flaky-reliability.retry-hardening`.

Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Input: `rig-services/testing.flaky-reliability.retry-hardening.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

minimal: retryable failures — ["connection reset"].

mid: maximum attempts — 3.

maximal: retry assertion failures — false.
