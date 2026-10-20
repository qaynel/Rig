# infrastructure.environment-config.feature-flags — minimal

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for feature flags. The minimal boundary for feature flags checks flag_names (nonempty): flag names must name the concrete repository contract. Binding checks: feature-flags-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe environment-config.feature-flags; bind it to the input named in `rig-services/infrastructure.environment-config.feature-flags.json` and preserve the check's failure status. When adopting this in an existing repository, connect feature flags to the command that inspects flag_names and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside environment-config.feature-flags as a failure.

Acceptance target: policy:infrastructure.environment-config.feature-flags:minimal:feature-flags-source-code-boundary.

Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array).
