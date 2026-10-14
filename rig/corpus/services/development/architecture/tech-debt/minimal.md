# development.architecture.tech-debt — minimal

Minimal establishes a non-vacuous policy boundary for tech debt. It checks debt_items (nonempty): debt items must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe architecture.tech-debt; bind it to the input named in `rig-services/development.architecture.tech-debt.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside architecture.tech-debt is a failure.

Acceptance target: fixture:development.architecture.tech-debt:policy-boundary. Given source-code is present and architecture.tech-debt is selected, pass only when the repository binding evaluates architecture.tech-debt and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent architecture concern. A passing policy check does not establish runtime behavior.
