# infrastructure.environment-config.feature-flags — floor and mutation-floor slice

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade slice `feature-flags-slice-floor`: List the feature flags in use. Unlisted flags accumulate untested branches, so name each one.
