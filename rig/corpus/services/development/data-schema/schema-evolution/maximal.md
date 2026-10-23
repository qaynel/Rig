# development.data-schema.schema-evolution — maximal

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade, maximal: Set removal of required fields to false. Removing a required field breaks existing readers, so use a distinct versioned transition instead. Cumulative with minimal and mid. Binding checks: schema-evolution-source-code-boundary, schema-evolution-data-schema-context, schema-evolution-evidence-receipt.

Acceptance target: policy:development.data-schema.schema-evolution:maximal:schema-evolution-source-code-boundary+schema-evolution-data-schema-context+schema-evolution-evidence-receipt.
Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array); schema-evolution-data-schema-context: `unknown_field_policy` is nonempty (a string or array); schema-evolution-evidence-receipt: `remove_required_fields` equals false.
