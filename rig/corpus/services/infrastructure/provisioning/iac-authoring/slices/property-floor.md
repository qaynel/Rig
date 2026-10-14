# infrastructure.provisioning.iac-authoring — property-floor slice

This slice bounds iac authoring to provisioning.iac-authoring. It uses `iac-authoring-slice-property-floor` and checks resource_names (nonempty): resource names must name the concrete repository contract..

Use a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.iac-authoring.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.
