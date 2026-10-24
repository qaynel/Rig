# infrastructure.storage.tiering-lifecycle — behavior-oracle slice

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade slice `tiering-lifecycle-slice-behavior-oracle`: List the storage classes data moves between. Unnamed tiers make transitions unreviewable, so name each class. Despite its name this slice is not a behavior oracle: it confirms storage classes, retention days and the early-delete flag are declared; it does not read bucket policies.
