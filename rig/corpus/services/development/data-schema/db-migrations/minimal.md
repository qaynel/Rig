# development.data-schema.db-migrations — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for db migrations. The minimal boundary for db migrations checks migration_order (nonempty): migration order must name the concrete repository contract.. Binding checks: db-migrations-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe data-schema.db-migrations; bind it to the input named in `rig-services/development.data-schema.db-migrations.json` and preserve the check's failure status. When adopting this in an existing repository, connect db migrations to the command that inspects migration_order and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside data-schema.db-migrations as a failure.

Acceptance target: fixture:development.data-schema.db-migrations:policy-boundary. Given source-code is present and data-schema.db-migrations is selected, pass only when the repository binding evaluates data-schema.db-migrations and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. The ceiling is db migrations configuration validation only; declared policy does not prove running db migrations behavior. Choose a repository-owned check that observes db migrations from rig-services/development.data-schema.db-migrations.json..

Service-specific evidence cues:
Offer: Keep migration ordering deterministic and preserve a tested recovery route. Destructive schema operations require their own explicit approval rather than inheriting ordinary migration consent.
minimal: migration order — ["001_create_items","002_add_owner"].
mid: rollback steps — ["drop owner column"].
maximal: destructive change approved — false.
