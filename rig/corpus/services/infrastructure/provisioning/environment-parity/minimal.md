# infrastructure.provisioning.environment-parity — minimal

Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Policy grade, minimal: List the environments compared. An unnamed environment is outside the check, so enumerate dev, staging and production as applicable. Binding checks: environment-parity-source-code-boundary.

Acceptance target: policy:infrastructure.provisioning.environment-parity:minimal:environment-parity-source-code-boundary.
Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array).
