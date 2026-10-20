# infrastructure.provisioning.iac-authoring — maximal

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Policy grade, maximal: Set applying without a reviewed plan to false. Applying unseen changes can destroy resources, so inspect the exact plan first. Cumulative with minimal and mid. Binding checks: iac-authoring-source-code-boundary, iac-authoring-provisioning-context, iac-authoring-evidence-receipt.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:maximal:iac-authoring-source-code-boundary+iac-authoring-provisioning-context+iac-authoring-evidence-receipt.
Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array); iac-authoring-provisioning-context: `state_backend` is nonempty (a string or array); iac-authoring-evidence-receipt: `apply_without_reviewed_plan` equals false.
