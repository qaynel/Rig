# infrastructure.provisioning.environment-parity — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for environment parity. It checks environments (nonempty): environments must name the concrete repository contract.. Binding checks: environment-parity-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe provisioning.environment-parity; bind it to the input named in `rig-services/infrastructure.provisioning.environment-parity.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside provisioning.environment-parity is a failure.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:policy-boundary. Given source-code is present and provisioning.environment-parity is selected, pass only when the repository binding evaluates provisioning.environment-parity and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Owned scope: `provisioning.environment-parity`.

Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.

Input: `rig-services/infrastructure.provisioning.environment-parity.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: environment parity configuration validation only; declared policy does not prove running environment parity behavior. Select an approved repository-owned command to verify that behavior.

minimal: environments — ["staging","production"].

mid: intentional differences — ["instance count"].

maximal: unrecorded differences allowed — false.
