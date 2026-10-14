# infrastructure.environment-config.feature-flags — property-floor slice

This slice bounds feature flags to environment-config.feature-flags. It uses `feature-flags-slice-property-floor` and checks flag_names (nonempty): flag names must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.environment-config.feature-flags.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than feature flags configuration validation only; declared policy does not prove running feature flags behavior. Select an approved repository-owned command to verify that behavior.
