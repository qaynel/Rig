# infrastructure.storage.db-provisioning — identity

db provisioning owns storage.db-provisioning. Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Keep sibling services in storage under their own verdicts. Read the configured input at `rig-services/infrastructure.storage.db-provisioning.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern.
