# development.data-schema.schema-evolution — mid

Mid adds repository context for schema evolution; it does not widen ownership beyond data-schema.schema-evolution. The context signals are unknown_field_policy.

Ground the decision in the existing repository's schema evolution convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in data-schema under their own verdicts.

Acceptance target: fixture:development.data-schema.schema-evolution:repository-context. Given data-schema.schema-evolution has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.
