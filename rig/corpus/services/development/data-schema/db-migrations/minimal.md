# development.data-schema.db-migrations — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db migrations. It checks migration_order (nonempty): migration order must name the concrete repository contract.. Binding checks: db-migrations-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe data-schema.db-migrations; bind it to the input named in `rig-services/development.data-schema.db-migrations.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside data-schema.db-migrations is a failure.

Acceptance target: fixture:development.data-schema.db-migrations:policy-boundary. Given source-code is present and data-schema.db-migrations is selected, pass only when the repository binding evaluates data-schema.db-migrations and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Owned scope: `data-schema.db-migrations`.

Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.

Input: `rig-services/development.data-schema.db-migrations.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: db migrations configuration validation only; declared policy does not prove running db migrations behavior. Select an approved repository-owned command to verify that behavior.

minimal: migration order — ["001_create_items","002_add_owner"].

mid: rollback steps — ["drop owner column"].

maximal: destructive change approved — false.
