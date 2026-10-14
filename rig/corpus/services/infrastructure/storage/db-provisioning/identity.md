# infrastructure.storage.db-provisioning — identity

Policy grade: db provisioning owns storage.db-provisioning. Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Keep neighboring storage services outside the db provisioning decision for storage.db-provisioning. Read the configured input at `rig-services/infrastructure.storage.db-provisioning.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Choose a repository-owned check that observes db provisioning from rig-services/infrastructure.storage.db-provisioning.json.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.

Service-specific evidence cues:
Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.
minimal: database version — "16".
mid: access scope — "private-network".
maximal: public database endpoint — false.
