# development.dependency-management.upgrades-migration — identity

Policy grade: upgrades migration owns dependency-management.upgrades-migration. Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Keep neighboring dependency-management services outside the upgrades migration decision for dependency-management.upgrades-migration. Read the configured input at `rig-services/development.dependency-management.upgrades-migration.json`; malformed input is still attributed to that path.

Disposition: executable. Ground the decision in the limit: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Choose a repository-owned check that observes upgrades migration from rig-services/development.dependency-management.upgrades-migration.json.

Acceptance target: policy:development.dependency-management.upgrades-migration:minimal:upgrades-migration-source-code-boundary.

Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array).
