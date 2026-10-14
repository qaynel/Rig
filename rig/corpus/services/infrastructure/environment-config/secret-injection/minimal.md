# infrastructure.environment-config.secret-injection — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for secret injection. The minimal boundary for secret injection checks secret_references (nonempty): secret references must name the concrete repository contract.. Binding checks: secret-injection-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe runtime-secret-injection, secret-injection-wiring; bind it to the input named in `rig-services/infrastructure.environment-config.secret-injection.json` and preserve the check's failure status. When adopting this in an existing repository, connect secret injection to the command that inspects secret_references and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside runtime-secret-injection, secret-injection-wiring as a failure.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:policy-boundary. Given source-code is present and runtime-secret-injection is selected, pass only when the repository binding evaluates runtime-secret-injection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. The ceiling is secret injection configuration validation only; declared policy does not prove running secret injection behavior. Choose a repository-owned check that observes secret injection from rig-services/infrastructure.environment-config.secret-injection.json..

Service-specific evidence cues:
Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.
minimal: secret references — ["vault://app/db"].
mid: delivery mechanism — "workload-identity".
maximal: plaintext secret values — false.
