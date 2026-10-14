# infrastructure.disaster-recovery.dr-runbooks — behavior-oracle slice

This slice bounds dr runbooks to disaster-recovery.dr-runbooks. It uses `dr-runbooks-slice-behavior-oracle` and checks recovery_steps (nonempty): recovery steps must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.
