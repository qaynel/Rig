# development.dependency-management.upgrades-migration — floor and mutation-floor slice

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade slice `upgrades-migration-slice-floor`: List the target version for each upgraded dependency. Without versions the upgrade scope is unbounded, so name package and target.
