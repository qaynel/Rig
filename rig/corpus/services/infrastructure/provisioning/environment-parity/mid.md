# infrastructure.provisioning.environment-parity — mid

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: environment-parity-source-code-boundary, environment-parity-provisioning-context.

Acceptance target: policy:infrastructure.provisioning.environment-parity:mid:environment-parity-source-code-boundary+environment-parity-provisioning-context.

Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array); environment-parity-provisioning-context: `intentional_differences` is nonempty (a string or array).
