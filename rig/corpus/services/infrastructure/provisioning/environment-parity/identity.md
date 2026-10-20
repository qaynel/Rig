# infrastructure.provisioning.environment-parity — identity

Policy grade: environment parity owns provisioning.environment-parity. Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Keep neighboring provisioning services outside the environment parity decision for provisioning.environment-parity. Use the configured input at `rig-services/infrastructure.provisioning.environment-parity.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Choose a repository-owned check that observes environment parity from rig-services/infrastructure.provisioning.environment-parity.json.

Acceptance target: policy:infrastructure.provisioning.environment-parity:minimal:environment-parity-source-code-boundary.

Declared predicates: environment-parity-source-code-boundary: `environments` is nonempty (a string or array).
