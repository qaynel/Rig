# development.data-schema.schema-evolution — minimal

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for schema evolution. The minimal boundary for schema evolution checks compatible_readers (nonempty): compatible readers must name the concrete repository contract. Binding checks: schema-evolution-source-code-boundary.

Read a repository-owned command or existing native check that can observe data-schema.schema-evolution; bind it to the input named in `rig-services/development.data-schema.schema-evolution.json` and preserve the check's failure status. When adopting this in an existing repository, connect schema evolution to the command that inspects compatible_readers and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside data-schema.schema-evolution as a failure.

Acceptance target: policy:development.data-schema.schema-evolution:minimal:schema-evolution-source-code-boundary.

Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array).
