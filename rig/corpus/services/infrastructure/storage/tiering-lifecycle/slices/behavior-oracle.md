# infrastructure.storage.tiering-lifecycle — behavior-oracle slice

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade slice. This slice bounds tiering lifecycle to storage.tiering-lifecycle. It uses `tiering-lifecycle-slice-behavior-oracle` and checks storage_classes (nonempty): storage classes must name the concrete repository contract.