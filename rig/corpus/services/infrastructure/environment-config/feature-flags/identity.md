# infrastructure.environment-config.feature-flags — identity

Policy grade: feature flags owns environment-config.feature-flags. Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Keep neighboring environment-config services outside the feature flags decision for environment-config.feature-flags. Start from the configured input at `rig-services/infrastructure.environment-config.feature-flags.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Choose a repository-owned check that observes feature flags from rig-services/infrastructure.environment-config.feature-flags.json.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:policy-boundary. Given source-code is present and environment-config.feature-flags is selected, pass only when the repository binding evaluates environment-config.feature-flags and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.

Service-specific evidence cues:
Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.
minimal: flag names — ["new_checkout"].
mid: rollback owner — "checkout team".
maximal: permanent unowned flags — false.
