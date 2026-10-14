# development.code-creation.feature-implementation — minimal

Minimal establishes a non-vacuous policy boundary for feature implementation. It checks acceptance_cases (nonempty): acceptance cases must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe code-creation.feature-implementation; bind it to the input named in `rig-services/development.code-creation.feature-implementation.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside code-creation.feature-implementation is a failure.

Acceptance target: fixture:development.code-creation.feature-implementation:policy-boundary. Given source-code is present and code-creation.feature-implementation is selected, pass only when the repository binding evaluates code-creation.feature-implementation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern. A passing policy check does not establish runtime behavior.
