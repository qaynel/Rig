# infrastructure.storage.db-provisioning — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for db provisioning; it does not widen ownership beyond storage.db-provisioning. The context signals are access_scope. Binding checks: db-provisioning-storage-context.

Start from the existing repository's db provisioning convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in storage under their own verdicts.

Acceptance target: fixture:infrastructure.storage.db-provisioning:repository-context. Given storage.db-provisioning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Owned scope: `storage.db-provisioning`.

Offer: Pin the database engine and restrict connectivity to its intended clients. Configuration conformance does not establish actual managed-service access controls.

Input: `rig-services/infrastructure.storage.db-provisioning.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db provisioning configuration validation only; declared policy does not prove running db provisioning behavior. Select an approved repository-owned command to verify that behavior.

minimal: database version — "16".

mid: access scope — "private-network".

maximal: public database endpoint — false.
