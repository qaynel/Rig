# infrastructure.environment-config.config-drift — property-floor slice

Name the configuration authority and compare observed settings on a defined schedule. Drift must become a visible finding instead of silently redefining the desired state.

Policy grade slice. This slice bounds config drift to environment-config.config-drift. It uses `config-drift-slice-property-floor` and checks authoritative_sources (nonempty): authoritative sources must name the concrete repository contract.