# testing.test-data.synthetic-data — maximal

Maximal adds a replayable evidence receipt for synthetic data. The evidence must preserve the generation_rules, seed, use_customer_records inputs that determined the result.

Use a second run against unchanged synthetic data inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.test-data.synthetic-data:evidence-replay. Given the test-data.synthetic-data binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
