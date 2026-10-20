# infrastructure.provisioning.environment-parity — identity

Policy grade: environment-parity owns provisioning.environment-parity. Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Configuration validation only, so it confirms environments, intentional differences and the unrecorded-difference flag are declared; it does not compare deployed resources.

Disposition: executable.
Acceptance target: policy:infrastructure.provisioning.environment-parity:minimal:environment-parity-source-code-boundary.
Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array).
