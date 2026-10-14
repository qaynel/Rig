# infrastructure.environment-config.secret-injection — minimal

Minimal establishes a non-vacuous policy boundary for secret injection. It checks secret_references (nonempty): secret references must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe runtime-secret-injection, secret-injection-wiring; bind it to the input named in `rig-services/infrastructure.environment-config.secret-injection.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside runtime-secret-injection, secret-injection-wiring is a failure.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:policy-boundary. Given source-code is present and runtime-secret-injection is selected, pass only when the repository binding evaluates runtime-secret-injection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. A passing policy check does not establish runtime behavior.
