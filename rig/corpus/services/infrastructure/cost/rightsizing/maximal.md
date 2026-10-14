# infrastructure.cost.rightsizing — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for rightsizing. The evidence must preserve the candidate_resources, minimum_headroom_percent, resize_without_workload_evidence inputs that determined the result. Binding checks: rightsizing-evidence-receipt.

Anchor the review on a second run against unchanged rightsizing inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.cost.rightsizing:evidence-replay. Given the cost.rightsizing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Owned scope: `cost.rightsizing`.

Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.

Input: `rig-services/infrastructure.cost.rightsizing.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Select an approved repository-owned command to verify that behavior.

minimal: candidate resources — ["worker pool"].

mid: minimum headroom percent — 20.

maximal: resize without workload evidence — false.
