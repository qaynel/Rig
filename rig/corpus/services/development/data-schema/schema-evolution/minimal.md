# development.data-schema.schema-evolution — minimal

Minimal establishes a non-vacuous policy boundary for schema evolution. It checks compatible_readers (nonempty): compatible readers must name the concrete repository contract..

Read a repository-owned command or existing native check that can observe data-schema.schema-evolution; bind it to the input named in `rig-services/development.data-schema.schema-evolution.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside data-schema.schema-evolution is a failure.

Acceptance target: fixture:development.data-schema.schema-evolution:policy-boundary. Given source-code is present and data-schema.schema-evolution is selected, pass only when the repository binding evaluates data-schema.schema-evolution and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. A passing policy check does not establish runtime behavior.
