# development.dependency-management.upgrades-migration — mid

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade, mid: Write the ordered migration steps. An unplanned upgrade breaks callers midway, so list each step and its check. Cumulative with minimal. Binding checks: upgrades-migration-source-code-boundary, upgrades-migration-dependency-management-context.

Acceptance target: policy:development.dependency-management.upgrades-migration:mid:upgrades-migration-source-code-boundary+upgrades-migration-dependency-management-context.
Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array); upgrades-migration-dependency-management-context: `migration_steps` is nonempty (a string or array).
