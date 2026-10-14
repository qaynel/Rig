# development.documentation.docstrings — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for docstrings. The minimal boundary for docstrings checks documented_symbols (nonempty): documented symbols must name the concrete repository contract.. Binding checks: docstrings-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe documentation.docstrings; bind it to the input named in `rig-services/development.documentation.docstrings.json` and preserve the check's failure status. When adopting this in an existing repository, connect docstrings to the command that inspects documented_symbols and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside documentation.docstrings as a failure.

Acceptance target: fixture:development.documentation.docstrings:policy-boundary. Given source-code is present and documentation.docstrings is selected, pass only when the repository binding evaluates documentation.docstrings and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. The ceiling is docstrings configuration validation only; declared policy does not prove running docstrings behavior. Choose a repository-owned check that observes docstrings from rig-services/development.documentation.docstrings.json..

Service-specific evidence cues:
Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.
minimal: documented symbols — ["parseRecord"].
mid: parameters — ["raw: serialized record"].
maximal: failure contract — "throws on malformed records".
