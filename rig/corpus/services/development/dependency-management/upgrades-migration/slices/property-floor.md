# development.dependency-management.upgrades-migration — property-floor slice

Policy grade slice. This slice bounds upgrades migration to dependency-management.upgrades-migration. It uses `upgrades-migration-slice-property-floor` and checks target_versions (nonempty): target versions must name the concrete repository contract..

Inspect a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.dependency-management.upgrades-migration.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Owned scope: `dependency-management.upgrades-migration`.

Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Input: `rig-services/development.dependency-management.upgrades-migration.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

minimal: target versions — ["library@2.0.0"].

mid: migration steps — ["replace removed API"].

maximal: rollback available — true.
