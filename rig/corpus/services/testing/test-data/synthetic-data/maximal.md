# testing.test-data.synthetic-data — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for synthetic data. The evidence must preserve the generation_rules, seed, use_customer_records inputs that determined the result. Binding checks: synthetic-data-evidence-receipt.

Use a second run against unchanged synthetic data inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.synthetic-data:evidence-replay. Given the test-data.synthetic-data binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Owned scope: `test-data.synthetic-data`.

Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.

Input: `rig-services/testing.test-data.synthetic-data.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

minimal: generation rules — ["valid account IDs"].

mid: seed — 42.

maximal: use customer records — false.
