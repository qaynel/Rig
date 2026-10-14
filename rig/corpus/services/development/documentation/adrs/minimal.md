# development.documentation.adrs — minimal

Minimal establishes a non-vacuous policy boundary for adrs. It checks decision (nonempty): decision must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe documentation.adrs; bind it to the input named in `rig-services/development.documentation.adrs.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.adrs is a failure.

Acceptance target: fixture:development.documentation.adrs:policy-boundary. Given source-code is present and documentation.adrs is selected, pass only when the repository binding evaluates documentation.adrs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.
