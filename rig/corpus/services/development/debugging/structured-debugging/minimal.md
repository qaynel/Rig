# development.debugging.structured-debugging — minimal

Minimal establishes a non-vacuous policy boundary for structured debugging. It checks reproduction_steps (nonempty): reproduction steps must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe debugging.structured-debugging; bind it to the input named in `rig-services/development.debugging.structured-debugging.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside debugging.structured-debugging is a failure.

Acceptance target: fixture:development.debugging.structured-debugging:policy-boundary. Given source-code is present and debugging.structured-debugging is selected, pass only when the repository binding evaluates debugging.structured-debugging and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern. A passing policy check does not establish runtime behavior.
