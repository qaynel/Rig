# infrastructure.provisioning.environment-parity — maximal

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: environment-parity-source-code-boundary, environment-parity-provisioning-context, environment-parity-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.provisioning.environment-parity:maximal:environment-parity-source-code-boundary+environment-parity-provisioning-context+environment-parity-evidence-receipt.

Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array); environment-parity-provisioning-context: `intentional_differences` is nonempty (a string or array); environment-parity-evidence-receipt: `unrecorded_differences_allowed` equals false.
