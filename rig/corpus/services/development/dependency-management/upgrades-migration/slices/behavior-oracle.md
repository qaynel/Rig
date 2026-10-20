# development.dependency-management.upgrades-migration — behavior-oracle slice

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade slice `upgrades-migration-slice-behavior-oracle`: List the target version for each upgraded dependency. Without versions the upgrade scope is unbounded, so name package and target. Despite its name this slice is not a behavior oracle: it confirms target versions, migration steps and rollback availability are declared; it does not show the upgrade is compatible.
