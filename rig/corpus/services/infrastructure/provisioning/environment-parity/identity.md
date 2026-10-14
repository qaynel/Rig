# infrastructure.provisioning.environment-parity — identity

environment parity owns provisioning.environment-parity. Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Keep sibling services in provisioning under their own verdicts. Use the configured input at `rig-services/infrastructure.provisioning.environment-parity.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:policy-boundary. Given source-code is present and provisioning.environment-parity is selected, pass only when the repository binding evaluates provisioning.environment-parity and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern.
