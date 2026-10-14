# infrastructure.storage.db-provisioning — minimal

Minimal establishes a non-vacuous policy boundary for db provisioning. It checks database_version (nonempty): database version must name the concrete repository contract..

Use a repository-owned command or existing native check that can observe storage.db-provisioning; bind it to the input named in `rig-services/infrastructure.storage.db-provisioning.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside storage.db-provisioning is a failure.

Acceptance target: fixture:infrastructure.storage.db-provisioning:policy-boundary. Given source-code is present and storage.db-provisioning is selected, pass only when the repository binding evaluates storage.db-provisioning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. A passing policy check does not establish runtime behavior.
