# infrastructure.provisioning.iac-authoring — floor and mutation-floor slice

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade slice. This slice bounds iac authoring to provisioning.iac-authoring. It uses `iac-authoring-slice-floor` and checks resource_names (nonempty): resource names must name the concrete repository contract.