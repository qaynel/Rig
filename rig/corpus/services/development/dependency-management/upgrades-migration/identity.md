# development.dependency-management.upgrades-migration — identity

Policy grade: upgrades-migration owns dependency-management.upgrades-migration. Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Input: `rig-services/development.dependency-management.upgrades-migration.json`. Configuration validation only, so it confirms target versions, migration steps and rollback availability are declared; it does not show the upgrade is compatible.

Disposition: executable.
Acceptance target: policy:development.dependency-management.upgrades-migration:minimal:upgrades-migration-source-code-boundary.
Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array).
