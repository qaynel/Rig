# infrastructure.storage.tiering-lifecycle — identity

Policy grade: tiering lifecycle owns storage.tiering-lifecycle. Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Keep neighboring storage services outside the tiering lifecycle decision for storage.tiering-lifecycle. Trace the verdict to the configured input at `rig-services/infrastructure.storage.tiering-lifecycle.json`; malformed input is still attributed to that path.

Disposition: executable. Anchor the review on the limit: tiering lifecycle configuration validation only; declared policy does not prove running tiering lifecycle behavior. Choose a repository-owned check that observes tiering lifecycle from rig-services/infrastructure.storage.tiering-lifecycle.json.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:minimal:tiering-lifecycle-source-code-boundary.

Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array).
