# infrastructure.provisioning.iac-authoring — maximal

Declare infrastructure resources with a recoverable state backend and inspect the exact plan before applying. Configuration checks do not establish live infrastructure behavior.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: iac-authoring-source-code-boundary, iac-authoring-provisioning-context, iac-authoring-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.provisioning.iac-authoring:maximal:iac-authoring-source-code-boundary+iac-authoring-provisioning-context+iac-authoring-evidence-receipt.

Declared predicates: iac-authoring-source-code-boundary: `resource_names` is nonempty (a string or array); iac-authoring-provisioning-context: `state_backend` is nonempty (a string or array); iac-authoring-evidence-receipt: `apply_without_reviewed_plan` equals false.
