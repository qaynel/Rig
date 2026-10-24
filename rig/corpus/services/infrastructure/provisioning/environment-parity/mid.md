# infrastructure.provisioning.environment-parity — mid

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade, mid: Record the differences that are intentional. Unexplained differences are drift, so document each deliberate one. Cumulative with minimal. Binding checks: environment-parity-source-code-boundary, environment-parity-provisioning-context.

Acceptance target: policy:infrastructure.provisioning.environment-parity:mid:environment-parity-source-code-boundary+environment-parity-provisioning-context.
Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array); environment-parity-provisioning-context: `intentional_differences` is nonempty (a string or array).
