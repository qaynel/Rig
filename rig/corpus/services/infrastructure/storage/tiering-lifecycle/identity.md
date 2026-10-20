# infrastructure.storage.tiering-lifecycle — identity

Policy grade: tiering-lifecycle owns storage.tiering-lifecycle. Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`. Configuration validation only, so it confirms storage classes, retention days and the early-delete flag are declared; it does not read bucket policies.

Disposition: executable.
Acceptance target: policy:infrastructure.storage.tiering-lifecycle:minimal:tiering-lifecycle-source-code-boundary.
Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array).
