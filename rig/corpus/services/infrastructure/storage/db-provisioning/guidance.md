# db-provisioning

Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Owned scope: `storage.db-provisioning`. Input: `rig-services/infrastructure.storage.db-provisioning.json`.

Coverage ceiling: Configuration validation only, so it confirms the database version, access scope and the public-endpoint flag are declared; it does not read the managed service.

minimal: database version — "16". Pin the database engine version. An unpinned engine upgrades unexpectedly, so record the exact version.

mid: access scope — "private-network". Restrict access to the intended clients, such as a private network or named roles. Open access exposes data, so declare the scope.

maximal: public database endpoint — false. Set public database endpoint to false. A publicly reachable database invites attack, so keep it on a private network.
