# infrastructure.provisioning.iac-authoring — mid

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: iac-authoring-source-code-boundary, iac-authoring-provisioning-context.

Tie acceptance to the existing repository's iac authoring convention, then name the source path or command that establishes it. For iac authoring, inspect the repository's actual spec, source, test, or configuration for state_backend; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring provisioning services outside the iac authoring decision for provisioning.iac-authoring.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:mid:iac-authoring-source-code-boundary+iac-authoring-provisioning-context.

Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array); iac-authoring-provisioning-context: `state_backend` is nonempty (a string or array).
