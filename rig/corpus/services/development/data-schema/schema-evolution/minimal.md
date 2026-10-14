# development.data-schema.schema-evolution — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for schema evolution. The minimal boundary for schema evolution checks compatible_readers (nonempty): compatible readers must name the concrete repository contract.. Binding checks: schema-evolution-source-code-boundary.

Read a repository-owned command or existing native check that can observe data-schema.schema-evolution; bind it to the input named in `rig-services/development.data-schema.schema-evolution.json` and preserve the check's failure status. When adopting this in an existing repository, connect schema evolution to the command that inspects compatible_readers and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside data-schema.schema-evolution as a failure.

Acceptance target: fixture:development.data-schema.schema-evolution:policy-boundary. Given source-code is present and data-schema.schema-evolution is selected, pass only when the repository binding evaluates data-schema.schema-evolution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. The ceiling is schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Choose a repository-owned check that observes schema evolution from rig-services/development.data-schema.schema-evolution.json..

Service-specific evidence cues:
Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.
minimal: compatible readers — ["v1","v2"].
mid: unknown field policy — "ignore-additive-fields".
maximal: remove required fields — false.
