# infrastructure.storage.tiering-lifecycle — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for tiering lifecycle. The evidence must preserve the storage_classes, retention_days, delete_before_retention inputs that determined the result. Binding checks: tiering-lifecycle-evidence-receipt.

Read a second run against unchanged tiering lifecycle inputs. Record the storage_classes, retention_days, delete_before_retention inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this tiering lifecycle result is stale. The ceiling remains: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Choose a repository-owned check that observes tiering lifecycle from rig-services/infrastructure.storage.tiering-lifecycle.json.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:evidence-replay. Given the storage.tiering-lifecycle binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.
minimal: storage classes — ["hot","archive"].
mid: retention days — 30.
maximal: delete before retention — false.
