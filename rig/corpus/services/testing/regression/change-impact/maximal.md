# testing.regression.change-impact — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for change impact. The evidence must preserve the changed_interfaces, affected_suites, select_by_filename_only inputs that determined the result. Binding checks: change-impact-evidence-receipt.

Trace the verdict to a second run against unchanged change impact inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.regression.change-impact:evidence-replay. Given the regression.change-impact binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Owned scope: `regression.change-impact`.

Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.

Input: `rig-services/testing.regression.change-impact.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: change impact configuration validation only; declared policy does not prove running change impact behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed interfaces — ["order serializer"].

mid: affected suites — ["order contract"].

maximal: select by filename only — false.
