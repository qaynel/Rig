# infrastructure.storage.tiering-lifecycle — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for tiering lifecycle; it does not widen ownership beyond storage.tiering-lifecycle. For tiering lifecycle, inspect these context signals: retention_days. Binding checks: tiering-lifecycle-storage-context.

Tie acceptance to the existing repository's tiering lifecycle convention, then name the source path or command that establishes it. For tiering lifecycle, inspect the repository's actual spec, source, test, or configuration for retention_days; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring storage services outside the tiering lifecycle decision for storage.tiering-lifecycle.

Acceptance target: fixture:infrastructure.storage.tiering-lifecycle:repository-context. Given storage.tiering-lifecycle has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent storage concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.
minimal: storage classes — ["hot","archive"].
mid: retention days — 30.
maximal: delete before retention — false.
