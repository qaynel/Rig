# development.documentation.docstrings — minimal

Minimal establishes a non-vacuous policy boundary for docstrings. It checks documented_symbols (nonempty): documented symbols must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe documentation.docstrings; bind it to the input named in `rig-services/development.documentation.docstrings.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.docstrings is a failure.

Acceptance target: fixture:development.documentation.docstrings:policy-boundary. Given source-code is present and documentation.docstrings is selected, pass only when the repository binding evaluates documentation.docstrings and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.
