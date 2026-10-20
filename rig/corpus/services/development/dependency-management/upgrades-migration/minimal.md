# development.dependency-management.upgrades-migration — minimal

Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for upgrades migration. The minimal boundary for upgrades migration checks target_versions (nonempty): target versions must name the concrete repository contract. Binding checks: upgrades-migration-source-code-boundary.

Use a repository-owned command or existing native check that can observe dependency-management.upgrades-migration; bind it to the input named in `rig-services/development.dependency-management.upgrades-migration.json` and preserve the check's failure status. When adopting this in an existing repository, connect upgrades migration to the command that inspects target_versions and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside dependency-management.upgrades-migration as a failure.

Acceptance target: policy:development.dependency-management.upgrades-migration:minimal:upgrades-migration-source-code-boundary.

Declared predicates: upgrades-migration-source-code-boundary: `target_versions` is nonempty (a string or array).
