# infrastructure.environment-config.feature-flags — identity

Policy grade: feature-flags owns environment-config.feature-flags. Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Input: `rig-services/infrastructure.environment-config.feature-flags.json`. Configuration validation only, so it confirms flag names, a rollback owner and the permanent-unowned flag are declared; it does not read live flag state.

Disposition: executable.
Acceptance target: policy:infrastructure.environment-config.feature-flags:minimal:feature-flags-source-code-boundary.
Declared predicates: feature-flags-source-code-boundary: `flag_names` is nonempty (a string or array).
