# testing.flaky-reliability.retry-hardening — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for retry hardening. The evidence must preserve the retryable_failures, maximum_attempts, retry_assertion_failures inputs that determined the result. Binding checks: retry-hardening-evidence-receipt.

Tie acceptance to a second run against unchanged retry hardening inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.retry-hardening:evidence-replay. Given the flaky-reliability.retry-hardening binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Owned scope: `flaky-reliability.retry-hardening`.

Offer: Retry only explicitly transient failures with a bounded attempt count. Repeating a failed assertion until it passes changes the test contract and hides deterministic defects.

Input: `rig-services/testing.flaky-reliability.retry-hardening.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.

minimal: retryable failures — ["connection reset"].

mid: maximum attempts — 3.

maximal: retry assertion failures — false.
