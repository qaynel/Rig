# infrastructure.storage.db-provisioning — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for db provisioning. The evidence must preserve the database_version, access_scope, public_database_endpoint inputs that determined the result. Binding checks: db-provisioning-evidence-receipt.

Trace the verdict to a second run against unchanged db provisioning inputs. Record the database_version, access_scope, public_database_endpoint inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this db provisioning result is stale. The ceiling remains: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Choose a repository-owned check that observes db provisioning from rig-services/infrastructure.storage.db-provisioning.json.

Acceptance target: fixture:infrastructure.storage.db-provisioning:evidence-replay. Given the storage.db-provisioning binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.
minimal: database version — "16".
mid: access scope — "private-network".
maximal: public database endpoint — false.
