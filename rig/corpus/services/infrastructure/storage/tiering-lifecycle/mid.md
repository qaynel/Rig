# infrastructure.storage.tiering-lifecycle — mid

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade, mid: Set retention to at least 30 days, or the data contract's period. Deleting earlier breaks the retention promise, so declare the minimum. Cumulative with minimal. Binding checks: tiering-lifecycle-source-code-boundary, tiering-lifecycle-storage-context.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:mid:tiering-lifecycle-source-code-boundary+tiering-lifecycle-storage-context.
Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array); tiering-lifecycle-storage-context: `retention_days` is numeric and at least 30.
