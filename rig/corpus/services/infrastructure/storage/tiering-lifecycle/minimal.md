# infrastructure.storage.tiering-lifecycle — minimal

Minimal establishes a non-vacuous policy boundary for tiering lifecycle. It checks storage_classes (nonempty): storage classes must name the concrete repository contract..

Inspect a repository-owned command or existing native check that can observe storage.tiering-lifecycle; bind it to the input named in `rig-services/infrastructure.storage.tiering-lifecycle.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside storage.tiering-lifecycle is a failure.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:policy-boundary. Given source-code is present and storage.tiering-lifecycle is selected, pass only when the repository binding evaluates storage.tiering-lifecycle and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent storage concern. A passing policy check does not establish runtime behavior.
