# infrastructure.provisioning.iac-authoring — floor and mutation-floor slice

Policy grade slice. This slice bounds iac authoring to provisioning.iac-authoring. It uses `iac-authoring-slice-floor` and checks resource_names (nonempty): resource names must name the concrete repository contract..

For iac authoring, choose a repository example that satisfies resource_names at the floor and mutation-floor floor, plus a failure where resource names must name the concrete repository contract. is false. For iac authoring, wire `floor and mutation-floor` to `rig-services/infrastructure.provisioning.iac-authoring.json` and keep its verdict on resource_names; missing evidence is a named gap, with ceiling iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Choose a repository-owned check that observes iac authoring from rig-services/infrastructure.provisioning.iac-authoring.json..

Service-specific evidence cues:
Offer: Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.
minimal: resource names — ["app-network"].
mid: state backend — "encrypted-remote".
maximal: apply without reviewed plan — false.
