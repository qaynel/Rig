# development.data-schema.schema-evolution — behavior-oracle slice

Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Policy grade slice `schema-evolution-slice-behavior-oracle`: List the old and new readers checked against the change. An empty list means compatibility was assumed, so name each consumer version. Despite its name this slice is not a behavior oracle: it confirms compatible readers, unknown-field handling and the no-removal setting are declared; it does not show old and new readers interoperate.
