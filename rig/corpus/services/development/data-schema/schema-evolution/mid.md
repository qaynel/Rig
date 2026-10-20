# development.data-schema.schema-evolution — mid

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: schema-evolution-source-code-boundary, schema-evolution-data-schema-context.

Ground the decision in the existing repository's schema evolution convention, then name the source path or command that establishes it. For schema evolution, inspect the repository's actual spec, source, test, or configuration for unknown_field_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring data-schema services outside the schema evolution decision for data-schema.schema-evolution.

Acceptance target: policy:development.data-schema.schema-evolution:mid:schema-evolution-source-code-boundary+schema-evolution-data-schema-context.

Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array); schema-evolution-data-schema-context: `unknown_field_policy` is nonempty (a string or array).
