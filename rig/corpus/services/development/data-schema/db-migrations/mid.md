# development.data-schema.db-migrations — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for db migrations; it does not widen ownership beyond data-schema.db-migrations. The context signals are rollback_steps. Binding checks: db-migrations-data-schema-context.

Anchor the review on the existing repository's db migrations convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in data-schema under their own verdicts.

Acceptance target: fixture:development.data-schema.db-migrations:repository-context. Given data-schema.db-migrations has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent data schema concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
