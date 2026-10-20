# infrastructure.environment-config.secret-injection — minimal

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for secret injection. The minimal boundary for secret injection checks secret_references (nonempty): secret references must name the concrete repository contract. Binding checks: secret-injection-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe runtime-secret-injection, secret-injection-wiring; bind it to the input named in `rig-services/infrastructure.environment-config.secret-injection.json` and preserve the check's failure status. When adopting this in an existing repository, connect secret injection to the command that inspects secret_references and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside runtime-secret-injection, secret-injection-wiring as a failure.

Acceptance target: policy:infrastructure.environment-config.secret-injection:minimal:secret-injection-source-code-boundary.

Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array).
