# development.data-schema.schema-evolution — behavior-oracle slice

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade slice. This slice bounds schema evolution to data-schema.schema-evolution. It uses `schema-evolution-slice-behavior-oracle` and checks compatible_readers (nonempty): compatible readers must name the concrete repository contract.