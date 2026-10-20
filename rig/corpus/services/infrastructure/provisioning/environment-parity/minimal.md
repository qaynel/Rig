# infrastructure.provisioning.environment-parity — minimal

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for environment parity. The minimal boundary for environment parity checks environments (nonempty): environments must name the concrete repository contract. Binding checks: environment-parity-source-code-boundary.

Acceptance target: policy:infrastructure.provisioning.environment-parity:minimal:environment-parity-source-code-boundary.

Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array).
