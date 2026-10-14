# infrastructure.provisioning.iac-authoring — behavior-oracle slice

This slice bounds iac authoring to provisioning.iac-authoring. It uses `iac-authoring-slice-behavior-oracle` and checks resource_names (nonempty): resource names must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.iac-authoring.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.
