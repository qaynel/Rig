# development.dependency-management.upgrades-migration — identity

Policy grade: upgrades migration owns dependency-management.upgrades-migration. Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Keep sibling services in dependency-management under their own verdicts. Read the configured input at `rig-services/development.dependency-management.upgrades-migration.json`; malformed input is still attributed to that path.

Disposition: convention. Ground the decision in the limit: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.dependency-management.upgrades-migration:policy-boundary. Given source-code is present and dependency-management.upgrades-migration is selected, pass only when the repository binding evaluates dependency-management.upgrades-migration and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent dependency management concern.

Service-specific evidence cues:
Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Owned scope: `dependency-management.upgrades-migration`.

Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Input: `rig-services/development.dependency-management.upgrades-migration.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Select an approved repository-owned command to verify that behavior.

minimal: target versions — ["library@2.0.0"].

mid: migration steps — ["replace removed API"].

maximal: rollback available — true.
