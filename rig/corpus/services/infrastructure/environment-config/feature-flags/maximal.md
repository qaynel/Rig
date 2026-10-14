# infrastructure.environment-config.feature-flags — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for feature flags. The evidence must preserve the flag_names, rollback_owner, permanent_unowned_flags inputs that determined the result. Binding checks: feature-flags-evidence-receipt.

Tie acceptance to a second run against unchanged feature flags inputs. Record the flag_names, rollback_owner, permanent_unowned_flags inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this feature flags result is stale. The ceiling remains: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Choose a repository-owned check that observes feature flags from rig-services/infrastructure.environment-config.feature-flags.json.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:evidence-replay. Given the environment-config.feature-flags binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.
minimal: flag names — ["new_checkout"].
mid: rollback owner — "checkout team".
maximal: permanent unowned flags — false.
