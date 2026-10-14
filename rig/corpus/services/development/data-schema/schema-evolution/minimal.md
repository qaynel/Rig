# development.data-schema.schema-evolution — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for schema evolution. It checks compatible_readers (nonempty): compatible readers must name the concrete repository contract.. Binding checks: schema-evolution-source-code-boundary.

Read a repository-owned command or existing native check that can observe data-schema.schema-evolution; bind it to the input named in `rig-services/development.data-schema.schema-evolution.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside data-schema.schema-evolution is a failure.

Acceptance target: fixture:development.data-schema.schema-evolution:policy-boundary. Given source-code is present and data-schema.schema-evolution is selected, pass only when the repository binding evaluates data-schema.schema-evolution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`.

Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

minimal: compatible readers — ["v1","v2"].

mid: unknown field policy — "ignore-additive-fields".

maximal: remove required fields — false.
