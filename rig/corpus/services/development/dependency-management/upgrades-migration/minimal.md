# development.dependency-management.upgrades-migration — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for upgrades migration. It checks target_versions (nonempty): target versions must name the concrete repository contract.. Binding checks: upgrades-migration-source-code-boundary.

Use a repository-owned command or existing native check that can observe dependency-management.upgrades-migration; bind it to the input named in `rig-services/development.dependency-management.upgrades-migration.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside dependency-management.upgrades-migration is a failure.

Acceptance target: fixture:development.dependency-management.upgrades-migration:policy-boundary. Given source-code is present and dependency-management.upgrades-migration is selected, pass only when the repository binding evaluates dependency-management.upgrades-migration and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Owned scope: `dependency-management.upgrades-migration`.

Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Input: `rig-services/development.dependency-management.upgrades-migration.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

minimal: target versions — ["library@2.0.0"].

mid: migration steps — ["replace removed API"].

maximal: rollback available — true.
