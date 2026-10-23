# infrastructure.storage.tiering-lifecycle — maximal

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade, maximal: Set deleting before retention to false. A lifecycle rule that destroys data early cannot be undone, so align expiry with retention. Cumulative with minimal and mid. Binding checks: tiering-lifecycle-source-code-boundary, tiering-lifecycle-storage-context, tiering-lifecycle-evidence-receipt.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:maximal:tiering-lifecycle-source-code-boundary+tiering-lifecycle-storage-context+tiering-lifecycle-evidence-receipt.
Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array); tiering-lifecycle-storage-context: `retention_days` is numeric and at least 30; tiering-lifecycle-evidence-receipt: `delete_before_retention` equals false.
