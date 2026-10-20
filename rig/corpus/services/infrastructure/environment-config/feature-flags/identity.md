# infrastructure.environment-config.feature-flags — identity

Policy grade: feature flags owns environment-config.feature-flags. Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Keep neighboring environment-config services outside the feature flags decision for environment-config.feature-flags. Start from the configured input at `rig-services/infrastructure.environment-config.feature-flags.json`; malformed input is still attributed to that path.

Disposition: executable. Trace the verdict to the limit: feature flags configuration validation only; declared policy does not prove running feature flags behavior. Choose a repository-owned check that observes feature flags from rig-services/infrastructure.environment-config.feature-flags.json.

Acceptance target: policy:infrastructure.environment-config.feature-flags:minimal:feature-flags-source-code-boundary.

Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array).
