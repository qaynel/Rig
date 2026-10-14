# development.data-schema.db-migrations — minimal

Minimal establishes a non-vacuous policy boundary for db migrations. It checks migration_order (nonempty): migration order must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe data-schema.db-migrations; bind it to the input named in `rig-services/development.data-schema.db-migrations.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside data-schema.db-migrations is a failure.

Acceptance target: fixture:development.data-schema.db-migrations:policy-boundary. Given source-code is present and data-schema.db-migrations is selected, pass only when the repository binding evaluates data-schema.db-migrations and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent data schema concern. A passing policy check does not establish runtime behavior.
