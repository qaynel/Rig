# development.dependency-management.upgrades-migration — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for upgrades migration; it does not widen ownership beyond dependency-management.upgrades-migration. For upgrades migration, inspect these context signals: migration_steps. Binding checks: upgrades-migration-dependency-management-context.

Start from the existing repository's upgrades migration convention, then name the source path or command that establishes it. For upgrades migration, inspect the repository's actual spec, source, test, or configuration for migration_steps; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring dependency-management services outside the upgrades migration decision for dependency-management.upgrades-migration.

Acceptance target: fixture:development.dependency-management.upgrades-migration:repository-context. Given dependency-management.upgrades-migration has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent dependency management concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.
minimal: target versions — ["library@2.0.0"].
mid: migration steps — ["replace removed API"].
maximal: rollback available — true.
