# infrastructure.environment-config.feature-flags — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for feature flags. The minimal boundary for feature flags checks flag_names (nonempty): flag names must name the concrete repository contract.. Binding checks: feature-flags-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe environment-config.feature-flags; bind it to the input named in `rig-services/infrastructure.environment-config.feature-flags.json` and preserve the check's failure status. When adopting this in an existing repository, connect feature flags to the command that inspects flag_names and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.feature-flags as a failure.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:policy-boundary. Given source-code is present and environment-config.feature-flags is selected, pass only when the repository binding evaluates environment-config.feature-flags and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. The ceiling is feature flags configuration validation only; declared policy does not prove running feature flags behavior. Choose a repository-owned check that observes feature flags from rig-services/infrastructure.environment-config.feature-flags.json..

Service-specific evidence cues:
Offer: Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.
minimal: flag names — ["new_checkout"].
mid: rollback owner — "checkout team".
maximal: permanent unowned flags — false.
