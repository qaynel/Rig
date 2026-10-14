# development.debugging.structured-debugging — property-floor slice

This slice bounds structured debugging to debugging.structured-debugging. It uses `structured-debugging-slice-property-floor` and checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.debugging.structured-debugging.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than structured debugging configuration validation only; declared policy does not prove running structured debugging behavior. Select an approved repository-owned command to verify that behavior.
