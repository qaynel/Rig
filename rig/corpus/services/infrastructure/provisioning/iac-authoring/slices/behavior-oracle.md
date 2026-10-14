# infrastructure.provisioning.iac-authoring — behavior-oracle slice

Policy grade slice. This slice bounds iac authoring to provisioning.iac-authoring. It uses `iac-authoring-slice-behavior-oracle` and checks resource_names (nonempty): resource names must name the concrete repository contract..

Use a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.iac-authoring.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Owned scope: `provisioning.iac-authoring`.

Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Select an approved repository-owned command to verify that behavior.

minimal: resource names — ["app-network"].

mid: state backend — "encrypted-remote".

maximal: apply without reviewed plan — false.
