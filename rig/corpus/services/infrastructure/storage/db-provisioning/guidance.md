# db provisioning

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Owned scope: `storage.db-provisioning`.

Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Input: `rig-services/infrastructure.storage.db-provisioning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

minimal: database version — "16".

mid: access scope — "private-network".

maximal: public database endpoint — false.
