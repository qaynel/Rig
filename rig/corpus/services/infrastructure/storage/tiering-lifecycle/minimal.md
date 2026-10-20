# infrastructure.storage.tiering-lifecycle — minimal

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade, minimal: List the storage classes data moves between. Unnamed tiers make transitions unreviewable, so name each class. Binding checks: tiering-lifecycle-source-code-boundary.

Acceptance target: policy:infrastructure.storage.tiering-lifecycle:minimal:tiering-lifecycle-source-code-boundary.
Declared predicates: tiering-lifecycle-source-code-boundary: `storage_classes` is nonempty (a string or array).
