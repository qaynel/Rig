# infrastructure.cicd.release-gating — property-floor slice

This slice bounds release gating to cicd.release-gating. It uses `release-gating-slice-property-floor` and checks required_gates (nonempty): required gates must name the concrete repository contract..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.cicd.release-gating.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than release gating configuration validation only; declared policy does not prove running release gating behavior. Select an approved repository-owned command to verify that behavior.
