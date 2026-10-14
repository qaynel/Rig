# development.data-schema.db-migrations — mid

Mid adds repository context for db migrations; it does not widen ownership beyond data-schema.db-migrations. The context signals are rollback_steps.

Anchor the review on the existing repository's db migrations convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in data-schema under their own verdicts.

Acceptance target: fixture:development.data-schema.db-migrations:repository-context. Given data-schema.db-migrations has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.
