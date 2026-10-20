# development.data-schema.schema-evolution — identity

Policy grade: schema-evolution owns data-schema.schema-evolution. Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Configuration validation only, so it confirms compatible readers, unknown-field handling and the no-removal setting are declared; it does not show old and new readers interoperate.

Disposition: executable.
Acceptance target: policy:development.data-schema.schema-evolution:minimal:schema-evolution-source-code-boundary.
Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array).
