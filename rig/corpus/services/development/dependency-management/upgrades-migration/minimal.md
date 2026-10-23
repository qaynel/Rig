# development.dependency-management.upgrades-migration — minimal

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Policy grade, minimal: List the target version for each upgraded dependency. Without versions the upgrade scope is unbounded, so name package and target. Binding checks: upgrades-migration-source-code-boundary.

Acceptance target: policy:development.dependency-management.upgrades-migration:minimal:upgrades-migration-source-code-boundary.
Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array).
