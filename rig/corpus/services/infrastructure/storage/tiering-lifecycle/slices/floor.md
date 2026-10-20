# infrastructure.storage.tiering-lifecycle — floor and mutation-floor slice

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade slice. This slice bounds tiering lifecycle to storage.tiering-lifecycle. It uses `tiering-lifecycle-slice-floor` and checks storage_classes (nonempty): storage classes must name the concrete repository contract.