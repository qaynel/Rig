# testing.regression.snapshot-golden — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for snapshot golden. The evidence must preserve the golden_paths, reviewed_diffs, automatic_snapshot_acceptance inputs that determined the result. Binding checks: snapshot-golden-evidence-receipt.

Tie acceptance to a second run against unchanged snapshot golden inputs. Record the golden_paths, reviewed_diffs, automatic_snapshot_acceptance inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this snapshot golden result is stale. The ceiling remains: snapshot golden configuration validation only; declared policy does not prove running snapshot golden behavior. Choose a repository-owned check that observes snapshot golden from rig-services/testing.regression.snapshot-golden.json.

Acceptance target: fixture:testing.regression.snapshot-golden:evidence-replay. Given the regression.snapshot-golden binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Review golden output differences against intended behavior before accepting them. Automatically updating snapshots turns the implementation output into its own expected result.
minimal: golden paths — ["fixtures/order.json"].
mid: reviewed diffs — ["field addition"].
maximal: automatic snapshot acceptance — false.
