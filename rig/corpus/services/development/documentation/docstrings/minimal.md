# development.documentation.docstrings — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for docstrings. It checks documented_symbols (nonempty): documented symbols must name the concrete repository contract.. Binding checks: docstrings-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe documentation.docstrings; bind it to the input named in `rig-services/development.documentation.docstrings.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.docstrings is a failure.

Acceptance target: fixture:development.documentation.docstrings:policy-boundary. Given source-code is present and documentation.docstrings is selected, pass only when the repository binding evaluates documentation.docstrings and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Owned scope: `documentation.docstrings`.

Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Input: `rig-services/development.documentation.docstrings.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented symbols — ["parseRecord"].

mid: parameters — ["raw: serialized record"].

maximal: failure contract — "throws on malformed records".
