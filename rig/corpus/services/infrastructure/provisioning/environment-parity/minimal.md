# infrastructure.provisioning.environment-parity — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for environment parity. The minimal boundary for environment parity checks environments (nonempty): environments must name the concrete repository contract.. Binding checks: environment-parity-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe provisioning.environment-parity; bind it to the input named in `rig-services/infrastructure.provisioning.environment-parity.json` and preserve the check's failure status. When adopting this in an existing repository, connect environment parity to the command that inspects environments and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside provisioning.environment-parity as a failure.

Acceptance target: fixture:infrastructure.provisioning.environment-parity:policy-boundary. Given source-code is present and provisioning.environment-parity is selected, pass only when the repository binding evaluates provisioning.environment-parity and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent provisioning concern. The ceiling is environment parity configuration validation only; declared policy does not prove running environment parity behavior. Choose a repository-owned check that observes environment parity from rig-services/infrastructure.provisioning.environment-parity.json..

Service-specific evidence cues:
Offer: Compare environments against their intentional differences and keep unexplained drift visible. Identical filenames are not evidence that deployed settings or resources agree.
minimal: environments — ["staging","production"].
mid: intentional differences — ["instance count"].
maximal: unrecorded differences allowed — false.
