# upgrades-migration

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Owned scope: `dependency-management.upgrades-migration`. Input: `rig-services/development.dependency-management.upgrades-migration.json`.

Coverage ceiling: Configuration validation only, so it confirms target versions, migration steps and rollback availability are declared; it does not show the upgrade is compatible.

minimal: target versions — ["library@2.0.0"]. List the target version for each upgraded dependency. Without versions the upgrade scope is unbounded, so name package and target.

mid: migration steps — ["replace removed API"]. Write the ordered migration steps. An unplanned upgrade breaks callers midway, so list each step and its check.

maximal: rollback available — true. Rollback availability must be true. If the prior dependency state is not recoverable a failed upgrade cannot be undone, so keep the lockfile or branch restorable.
