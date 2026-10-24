# development.dependency-management.upgrades-migration — maximal

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade, maximal: Rollback availability must be true. If the prior dependency state is not recoverable a failed upgrade cannot be undone, so keep the lockfile or branch restorable. Cumulative with minimal and mid. Binding checks: upgrades-migration-source-code-boundary, upgrades-migration-dependency-management-context, upgrades-migration-evidence-receipt.

Acceptance target: policy:development.dependency-management.upgrades-migration:maximal:upgrades-migration-source-code-boundary+upgrades-migration-dependency-management-context+upgrades-migration-evidence-receipt.
Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array); upgrades-migration-dependency-management-context: `migration_steps` is nonempty (a string or array); upgrades-migration-evidence-receipt: `rollback_available` equals true.
