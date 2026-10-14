# development.data-schema.db-migrations — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for db migrations; it does not widen ownership beyond data-schema.db-migrations. For db migrations, inspect these context signals: rollback_steps. Binding checks: db-migrations-data-schema-context.

Anchor the review on the existing repository's db migrations convention, then name the source path or command that establishes it. For db migrations, inspect the repository's actual spec, source, test, or configuration for rollback_steps; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring data-schema services outside the db migrations decision for data-schema.db-migrations.

Acceptance target: fixture:development.data-schema.db-migrations:repository-context. Given data-schema.db-migrations has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.
minimal: migration order — ["001_create_items","002_add_owner"].
mid: rollback steps — ["drop owner column"].
maximal: destructive change approved — false.
