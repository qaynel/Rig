# infrastructure.provisioning.environment-parity — maximal

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade, maximal: Set unrecorded differences allowed to false. A hidden difference makes staging results meaningless, so record or remove it. Cumulative with minimal and mid. Binding checks: environment-parity-source-code-boundary, environment-parity-provisioning-context, environment-parity-evidence-receipt.

Acceptance target: policy:infrastructure.provisioning.environment-parity:maximal:environment-parity-source-code-boundary+environment-parity-provisioning-context+environment-parity-evidence-receipt.
Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array); environment-parity-provisioning-context: `intentional_differences` is nonempty (a string or array); environment-parity-evidence-receipt: `unrecorded_differences_allowed` equals false.
