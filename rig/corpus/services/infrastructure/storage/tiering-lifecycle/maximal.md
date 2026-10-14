# infrastructure.storage.tiering-lifecycle — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for tiering lifecycle. The evidence must preserve the storage_classes, retention_days, delete_before_retention inputs that determined the result. Binding checks: tiering-lifecycle-evidence-receipt.

Read a second run against unchanged tiering lifecycle inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:evidence-replay. Given the storage.tiering-lifecycle binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Owned scope: `storage.tiering-lifecycle`.

Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Select an approved repository-owned command to verify that behavior.

minimal: storage classes — ["hot","archive"].

mid: retention days — 30.

maximal: delete before retention — false.
