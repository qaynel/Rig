# infrastructure.provisioning.iac-authoring — minimal

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade, minimal: List the resources the code declares. Unlisted resources escape review, so name each one. Binding checks: iac-authoring-source-code-boundary.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:minimal:iac-authoring-source-code-boundary.
Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array).
