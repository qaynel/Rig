# development.dependency-management.upgrades-migration — mid

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: upgrades-migration-source-code-boundary, upgrades-migration-dependency-management-context.

Start from the existing repository's upgrades migration convention, then name the source path or command that establishes it. For upgrades migration, inspect the repository's actual spec, source, test, or configuration for migration_steps; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring dependency-management services outside the upgrades migration decision for dependency-management.upgrades-migration.

Acceptance target: policy:development.dependency-management.upgrades-migration:mid:upgrades-migration-source-code-boundary+upgrades-migration-dependency-management-context.

Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array); upgrades-migration-dependency-management-context: `migration_steps` is nonempty (a string or array).
