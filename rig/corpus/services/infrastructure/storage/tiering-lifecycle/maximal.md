# infrastructure.storage.tiering-lifecycle — maximal

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: tiering-lifecycle-source-code-boundary, tiering-lifecycle-storage-context, tiering-lifecycle-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:maximal:tiering-lifecycle-source-code-boundary+tiering-lifecycle-storage-context+tiering-lifecycle-evidence-receipt.

Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array); tiering-lifecycle-storage-context: `retention_days` is numeric and at least 30; tiering-lifecycle-evidence-receipt: `delete_before_retention` equals false.
