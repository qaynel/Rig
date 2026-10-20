# infrastructure.provisioning.iac-authoring — identity

Policy grade: iac authoring owns provisioning.iac-authoring. Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Keep neighboring provisioning services outside the iac authoring decision for provisioning.iac-authoring. Trace the verdict to the configured input at `rig-services/infrastructure.provisioning.iac-authoring.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: iac authoring configuration validation only; declared policy does not prove running iac authoring behavior. Choose a repository-owned check that observes iac authoring from rig-services/infrastructure.provisioning.iac-authoring.json.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:minimal:iac-authoring-source-code-boundary.

Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array).
