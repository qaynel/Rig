# development.dependency-management.upgrades-migration — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for upgrades migration. The evidence must preserve the target_versions, migration_steps, rollback_available inputs that determined the result. Binding checks: upgrades-migration-evidence-receipt.

Trace the verdict to a second run against unchanged upgrades migration inputs. Record the target_versions, migration_steps, rollback_available inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this upgrades migration result is stale. The ceiling remains: upgrades migration configuration validation only; declared policy does not prove running upgrades migration behavior. Choose a repository-owned check that observes upgrades migration from rig-services/development.dependency-management.upgrades-migration.json.

Acceptance target: fixture:development.dependency-management.upgrades-migration:evidence-replay. Given the dependency-management.upgrades-migration binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Inventory the target versions and deliberate migration steps. Keep the prior dependency state recoverable until compatibility checks prove that the upgrade can stay.
minimal: target versions — ["library@2.0.0"].
mid: migration steps — ["replace removed API"].
maximal: rollback available — true.
