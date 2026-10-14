# testing.test-data.synthetic-data — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for synthetic data. The evidence must preserve the generation_rules, seed, use_customer_records inputs that determined the result. Binding checks: synthetic-data-evidence-receipt.

Use a second run against unchanged synthetic data inputs. Record the generation_rules, seed, use_customer_records inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this synthetic data result is stale. The ceiling remains: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Choose a repository-owned check that observes synthetic data from rig-services/testing.test-data.synthetic-data.json.

Acceptance target: fixture:testing.test-data.synthetic-data:evidence-replay. Given the test-data.synthetic-data binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Produce deterministic synthetic records that satisfy real domain constraints. Customer data must not become a convenient test-data source when a reproducible generator can cover the behavior.
minimal: generation rules — ["valid account IDs"].
mid: seed — 42.
maximal: use customer records — false.
