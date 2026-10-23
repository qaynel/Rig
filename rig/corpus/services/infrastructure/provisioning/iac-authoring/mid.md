# infrastructure.provisioning.iac-authoring — mid

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade, mid: Declare a recoverable state backend. Local state is lost with the machine, so configure remote locked storage. Cumulative with minimal. Binding checks: iac-authoring-source-code-boundary, iac-authoring-provisioning-context.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:mid:iac-authoring-source-code-boundary+iac-authoring-provisioning-context.
Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array); iac-authoring-provisioning-context: `state_backend` is nonempty (a string or array).
