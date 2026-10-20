# development.data-schema.schema-evolution — minimal

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade, minimal: List the old and new readers checked against the change. An empty list means compatibility was assumed, so name each consumer version. Binding checks: schema-evolution-source-code-boundary.

Acceptance target: policy:development.data-schema.schema-evolution:minimal:schema-evolution-source-code-boundary.
Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array).
