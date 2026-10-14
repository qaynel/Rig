# infrastructure.cost.rightsizing — maximal

Maximal adds a replayable evidence receipt for rightsizing. The evidence must preserve the candidate_resources, minimum_headroom_percent, resize_without_workload_evidence inputs that determined the result.

Anchor the review on a second run against unchanged rightsizing inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.rightsizing:evidence-replay. Given the cost.rightsizing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
