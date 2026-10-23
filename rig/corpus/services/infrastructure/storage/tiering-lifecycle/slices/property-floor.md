# infrastructure.storage.tiering-lifecycle — property-floor slice

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Policy grade slice `tiering-lifecycle-slice-property-floor`: List the storage classes data moves between. Unnamed tiers make transitions unreviewable, so name each class.
