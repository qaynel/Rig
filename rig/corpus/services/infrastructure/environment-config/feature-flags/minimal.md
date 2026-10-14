# infrastructure.environment-config.feature-flags — minimal

Minimal establishes a non-vacuous policy boundary for feature flags. It checks flag_names (nonempty): flag names must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe environment-config.feature-flags; bind it to the input named in `rig-services/infrastructure.environment-config.feature-flags.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside environment-config.feature-flags is a failure.

Acceptance target: fixture:infrastructure.environment-config.feature-flags:policy-boundary. Given source-code is present and environment-config.feature-flags is selected, pass only when the repository binding evaluates environment-config.feature-flags and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. A passing policy check does not establish runtime behavior.
