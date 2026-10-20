# infrastructure.storage.tiering-lifecycle — mid

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: tiering-lifecycle-source-code-boundary, tiering-lifecycle-storage-context.

Tie acceptance to the existing repository's tiering lifecycle convention, then name the source path or command that establishes it. For tiering lifecycle, inspect the repository's actual spec, source, test, or configuration for retention_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the tiering lifecycle decision for storage.tiering-lifecycle.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:mid:tiering-lifecycle-source-code-boundary+tiering-lifecycle-storage-context.

Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array); tiering-lifecycle-storage-context: `retention_days` is numeric and at least 30.
