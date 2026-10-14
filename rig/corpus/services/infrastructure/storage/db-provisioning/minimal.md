# infrastructure.storage.db-provisioning — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db provisioning. It checks database_version (nonempty): database version must name the concrete repository contract.. Binding checks: db-provisioning-source-code-boundary.

Use a repository-owned command or existing native check that can observe storage.db-provisioning; bind it to the input named in `rig-services/infrastructure.storage.db-provisioning.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside storage.db-provisioning is a failure.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Owned scope: `storage.db-provisioning`.

Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Input: `rig-services/infrastructure.storage.db-provisioning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

minimal: database version — "16".

mid: access scope — "private-network".

maximal: public database endpoint — false.
