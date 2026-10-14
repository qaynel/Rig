# development.data-schema.schema-evolution — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for schema evolution; it does not widen ownership beyond data-schema.schema-evolution. For schema evolution, inspect these context signals: unknown_field_policy. Binding checks: schema-evolution-data-schema-context.

Ground the decision in the existing repository's schema evolution convention, then name the source path or command that establishes it. For schema evolution, inspect the repository's actual spec, source, test, or configuration for unknown_field_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring data-schema services outside the schema evolution decision for data-schema.schema-evolution.

Acceptance target: fixture:development.data-schema.schema-evolution:repository-context. Given data-schema.schema-evolution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.
minimal: compatible readers — ["v1","v2"].
mid: unknown field policy — "ignore-additive-fields".
maximal: remove required fields — false.
