# development.dependency-management.upgrades-migration — maximal

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: upgrades-migration-source-code-boundary, upgrades-migration-dependency-management-context, upgrades-migration-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:development.dependency-management.upgrades-migration:maximal:upgrades-migration-source-code-boundary+upgrades-migration-dependency-management-context+upgrades-migration-evidence-receipt.

Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array); upgrades-migration-dependency-management-context: `migration_steps` is nonempty (a string or array); upgrades-migration-evidence-receipt: `rollback_available` equals true.
