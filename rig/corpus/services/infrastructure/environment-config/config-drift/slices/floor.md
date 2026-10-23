# infrastructure.environment-config.config-drift — floor and mutation-floor slice

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade slice `config-drift-slice-floor`: Name the configuration authority each setting is compared to. Without one, drift has no reference, so list the source of truth.
