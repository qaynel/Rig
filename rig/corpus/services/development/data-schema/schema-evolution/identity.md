# development.data-schema.schema-evolution — identity

Policy grade: schema evolution owns data-schema.schema-evolution. Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Keep neighboring data-schema services outside the schema evolution decision for data-schema.schema-evolution. Inspect the configured input at `rig-services/development.data-schema.schema-evolution.json`; malformed input is still attributed to that path.

Disposition: executable. Tie acceptance to the limit: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Choose a repository-owned check that observes schema evolution from rig-services/development.data-schema.schema-evolution.json.

Acceptance target: policy:development.data-schema.schema-evolution:minimal:schema-evolution-source-code-boundary.

Declared predicates: schema-evolution-source-code-boundary: `compatible_readers` is nonempty (a string or array).
