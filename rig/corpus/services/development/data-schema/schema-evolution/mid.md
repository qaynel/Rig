# development.data-schema.schema-evolution — mid

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade, mid: Declare how readers treat unknown fields, such as ignore or reject. Undefined handling breaks forward compatibility, so state the rule. Cumulative with minimal. Binding checks: schema-evolution-source-code-boundary, schema-evolution-data-schema-context.

Acceptance target: policy:development.data-schema.schema-evolution:mid:schema-evolution-source-code-boundary+schema-evolution-data-schema-context.
Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array); schema-evolution-data-schema-context: `unknown_field_policy` is nonempty (a string or array).
