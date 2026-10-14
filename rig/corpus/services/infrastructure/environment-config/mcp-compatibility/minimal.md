# infrastructure.environment-config.mcp-compatibility — minimal

Minimal establishes a non-vacuous policy boundary for mcp compatibility. It checks transport (nonempty): transport must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe environment-config.mcp-compatibility; bind it to the input named in `rig-services/infrastructure.environment-config.mcp-compatibility.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside environment-config.mcp-compatibility is a failure.

Acceptance target: fixture:infrastructure.environment-config.mcp-compatibility:policy-boundary. Given source-code is present and environment-config.mcp-compatibility is selected, pass only when the repository binding evaluates environment-config.mcp-compatibility and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern. A passing policy check does not establish runtime behavior.
