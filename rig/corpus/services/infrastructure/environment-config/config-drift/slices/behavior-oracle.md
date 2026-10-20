# infrastructure.environment-config.config-drift — behavior-oracle slice

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade slice `config-drift-slice-behavior-oracle`: Name the configuration authority each setting is compared to. Without one, drift has no reference, so list the source of truth. Despite its name this slice is not a behavior oracle: it confirms authoritative sources, a comparison schedule and the silent-drift flag are declared; it does not compare live settings.
