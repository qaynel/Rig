# infrastructure.environment-config.feature-flags — behavior-oracle slice

Policy grade slice. This slice bounds feature flags to environment-config.feature-flags. It uses `feature-flags-slice-behavior-oracle` and checks flag_names (nonempty): flag names must name the concrete repository contract..

For feature flags, choose a repository example that satisfies flag_names at the behavior-oracle floor, plus a failure where flag names must name the concrete repository contract. is false. For feature flags, wire `behavior-oracle` to `rig-services/infrastructure.environment-config.feature-flags.json` and keep its verdict on flag_names; missing evidence is a named gap, with ceiling feature flags configuration validation only; declared policy does not prove running feature flags behavior. Choose a repository-owned check that observes feature flags from rig-services/infrastructure.environment-config.feature-flags.json..

Service-specific evidence cues:
Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.
minimal: flag names — ["new_checkout"].
mid: rollback owner — "checkout team".
maximal: permanent unowned flags — false.
