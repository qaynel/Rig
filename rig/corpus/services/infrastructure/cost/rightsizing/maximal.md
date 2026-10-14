# infrastructure.cost.rightsizing — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for rightsizing. The evidence must preserve the candidate_resources, minimum_headroom_percent, resize_without_workload_evidence inputs that determined the result. Binding checks: rightsizing-evidence-receipt.

Anchor the review on a second run against unchanged rightsizing inputs. Record the candidate_resources, minimum_headroom_percent, resize_without_workload_evidence inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this rightsizing result is stale. The ceiling remains: rightsizing configuration validation only; declared policy does not prove running rightsizing behavior. Choose a repository-owned check that observes rightsizing from rig-services/infrastructure.cost.rightsizing.json.

Acceptance target: fixture:infrastructure.cost.rightsizing:evidence-replay. Given the cost.rightsizing binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Choose resizing candidates from workload measurements while retaining headroom. Resource configuration alone cannot justify shrinking a production service.
minimal: candidate resources — ["worker pool"].
mid: minimum headroom percent — 20.
maximal: resize without workload evidence — false.
