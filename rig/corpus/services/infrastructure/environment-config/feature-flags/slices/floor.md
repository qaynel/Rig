# infrastructure.environment-config.feature-flags — floor and mutation-floor slice

Give feature flags an owner and a rollback route. Unowned permanent flags accumulate untested branches and should not pass as deliberate release controls.

Policy grade slice. This slice bounds feature flags to environment-config.feature-flags. It uses `feature-flags-slice-floor` and checks flag_names (nonempty): flag names must name the concrete repository contract.