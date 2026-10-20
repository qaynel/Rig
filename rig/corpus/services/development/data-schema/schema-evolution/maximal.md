# development.data-schema.schema-evolution — maximal

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: schema-evolution-source-code-boundary, schema-evolution-data-schema-context, schema-evolution-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.data-schema.schema-evolution:maximal:schema-evolution-source-code-boundary+schema-evolution-data-schema-context+schema-evolution-evidence-receipt.

Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array); schema-evolution-data-schema-context: `unknown_field_policy` is nonempty (a string or array); schema-evolution-evidence-receipt: `remove_required_fields` equals false.
