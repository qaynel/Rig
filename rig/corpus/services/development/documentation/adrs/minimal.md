# development.documentation.adrs — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for adrs. It checks decision (nonempty): decision must name the concrete repository contract.. Binding checks: adrs-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe documentation.adrs; bind it to the input named in `rig-services/development.documentation.adrs.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside documentation.adrs is a failure.

Acceptance target: fixture:development.documentation.adrs:policy-boundary. Given source-code is present and documentation.adrs is selected, pass only when the repository binding evaluates documentation.adrs and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent documentation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Owned scope: `documentation.adrs`.

Offer: Record the chosen approach, credible alternatives and concrete consequences. A decision record should explain the tradeoff that shaped the system rather than restating the implementation.

Input: `rig-services/development.documentation.adrs.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: adrs configuration validation only; declared policy does not prove running adrs behavior. Select an approved repository-owned command to verify that behavior.

minimal: decision — "Use the existing journal for recovery".

mid: alternatives — ["overwrite files directly"].

maximal: consequences — ["recoverable preimages"].
