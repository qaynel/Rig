# infrastructure.environment-config.feature-flags — behavior-oracle slice

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade slice `feature-flags-slice-behavior-oracle`: List the feature flags in use. Unlisted flags accumulate untested branches, so name each one. Despite its name this slice is not a behavior oracle: it confirms flag names, a rollback owner and the permanent-unowned flag are declared; it does not read live flag state.
