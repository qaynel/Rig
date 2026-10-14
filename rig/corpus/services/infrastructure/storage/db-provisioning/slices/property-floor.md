# infrastructure.storage.db-provisioning — property-floor slice

Policy grade slice. This slice bounds db provisioning to storage.db-provisioning. It uses `db-provisioning-slice-property-floor` and checks database_version (nonempty): database version must name the concrete repository contract..

For db provisioning, choose a repository example that satisfies database_version at the property-floor floor, plus a failure where database version must name the concrete repository contract. is false. For db provisioning, wire `property-floor` to `rig-services/infrastructure.storage.db-provisioning.json` and keep its verdict on database_version; missing evidence is a named gap, with ceiling db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Choose a repository-owned check that observes db provisioning from rig-services/infrastructure.storage.db-provisioning.json..

Service-specific evidence cues:
Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.
minimal: database version — "16".
mid: access scope — "private-network".
maximal: public database endpoint — false.
