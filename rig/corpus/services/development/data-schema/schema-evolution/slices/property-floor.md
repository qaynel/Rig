# development.data-schema.schema-evolution — property-floor slice

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade slice `schema-evolution-slice-property-floor`: List the old and new readers checked against the change. An empty list means compatibility was assumed, so name each consumer version.
