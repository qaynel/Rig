# infrastructure.provisioning.iac-authoring — identity

Policy grade: iac-authoring owns provisioning.iac-authoring. Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Input: `rig-services/infrastructure.provisioning.iac-authoring.json`. Configuration validation only, so it confirms resource names, a state backend and the unreviewed-apply flag are declared; it does not read live infrastructure.

Disposition: executable.
Acceptance target: policy:infrastructure.provisioning.iac-authoring:minimal:iac-authoring-source-code-boundary.
Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array).
