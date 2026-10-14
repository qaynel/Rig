# development.documentation.adrs — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for adrs. The minimal boundary for adrs checks decision (nonempty): decision must name the concrete repository contract.. Binding checks: adrs-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe documentation.adrs; bind it to the input named in `rig-services/development.documentation.adrs.json` and preserve the check's failure status. When adopting this in an existing repository, connect adrs to the command that inspects decision and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside documentation.adrs as a failure.

Acceptance target: fixture:development.documentation.adrs:policy-boundary. Given source-code is present and documentation.adrs is selected, pass only when the repository binding evaluates documentation.adrs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. The ceiling is adrs configuration validation only; declared policy does not prove running adrs behavior. Choose a repository-owned check that observes adrs from rig-services/development.documentation.adrs.json..

Service-specific evidence cues:
Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.
minimal: decision — "Use the existing journal for recovery".
mid: alternatives — ["overwrite files directly"].
maximal: consequences — ["recoverable preimages"].
