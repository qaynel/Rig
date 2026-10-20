# development.dependency-management.upgrades-migration — floor and mutation-floor slice

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade slice. This slice bounds upgrades migration to dependency-management.upgrades-migration. It uses `upgrades-migration-slice-floor` and checks target_versions (nonempty): target versions must name the concrete repository contract.