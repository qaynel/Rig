# development.data-schema.schema-evolution — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for schema evolution; it does not widen ownership beyond data-schema.schema-evolution. The context signals are unknown_field_policy. Binding checks: schema-evolution-data-schema-context.

Ground the decision in the existing repository's schema evolution convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in data-schema under their own verdicts.

Acceptance target: fixture:development.data-schema.schema-evolution:repository-context. Given data-schema.schema-evolution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Owned scope: `data-schema.schema-evolution`.

Offer: Check old and new readers against additive evolution and define unknown-field handling. Removing required fields breaks compatibility and needs a distinct versioned transition.

Input: `rig-services/development.data-schema.schema-evolution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: schema evolution configuration validation only; declared policy does not prove running schema evolution behavior. Select an approved repository-owned command to verify that behavior.

minimal: compatible readers — ["v1","v2"].

mid: unknown field policy — "ignore-additive-fields".

maximal: remove required fields — false.
