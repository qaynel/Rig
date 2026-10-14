# infrastructure.storage.db-provisioning — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for db provisioning. The evidence must preserve the database_version, access_scope, public_database_endpoint inputs that determined the result. Binding checks: db-provisioning-evidence-receipt.

Trace the verdict to a second run against unchanged db provisioning inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.storage.db-provisioning:evidence-replay. Given the storage.db-provisioning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Owned scope: `storage.db-provisioning`.

Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Input: `rig-services/infrastructure.storage.db-provisioning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

minimal: database version — "16".

mid: access scope — "private-network".

maximal: public database endpoint — false.
