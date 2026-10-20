# infrastructure.storage.tiering-lifecycle — minimal

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for tiering lifecycle. The minimal boundary for tiering lifecycle checks storage_classes (nonempty): storage classes must name the concrete repository contract. Binding checks: tiering-lifecycle-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe storage.tiering-lifecycle; bind it to the input named in `rig-services/infrastructure.storage.tiering-lifecycle.json` and preserve the check's failure status. When adopting this in an existing repository, connect tiering lifecycle to the command that inspects storage_classes and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside storage.tiering-lifecycle as a failure.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:minimal:tiering-lifecycle-source-code-boundary.

Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array).
