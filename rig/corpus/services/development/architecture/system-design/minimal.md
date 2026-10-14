# development.architecture.system-design — minimal

Minimal establishes a non-vacuous policy boundary for system design. It checks components (nonempty): components must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe architecture.system-design; bind it to the input named in `rig-services/development.architecture.system-design.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside architecture.system-design is a failure.

Acceptance target: fixture:development.architecture.system-design:policy-boundary. Given source-code is present and architecture.system-design is selected, pass only when the repository binding evaluates architecture.system-design and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. A passing policy check does not establish runtime behavior.
