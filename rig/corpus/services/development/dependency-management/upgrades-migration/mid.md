# development.dependency-management.upgrades-migration — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for upgrades migration; it does not widen ownership beyond dependency-management.upgrades-migration. The context signals are migration_steps. Binding checks: upgrades-migration-dependency-management-context.

Start from the existing repository's upgrades migration convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in dependency-management under their own verdicts.

Acceptance target: fixture:development.dependency-management.upgrades-migration:repository-context. Given dependency-management.upgrades-migration has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent dependency management concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Owned scope: `dependency-management.upgrades-migration`.

Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Input: `rig-services/development.dependency-management.upgrades-migration.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

minimal: target versions — ["library@2.0.0"].

mid: migration steps — ["replace removed API"].

maximal: rollback available — true.
