# tiering-lifecycle

Define storage transitions and retention from the data contract. Lifecycle rules must not destroy data before its retention requirement expires.

Owned scope: `storage.tiering-lifecycle`. Input: `rig-services/infrastructure.storage.tiering-lifecycle.json`.

Coverage ceiling: Configuration validation only, so it confirms storage classes, retention days and the early-delete flag are declared; it does not read bucket policies.

minimal: storage classes — ["hot","archive"]. List the storage classes data moves between. Unnamed tiers make transitions unreviewable, so name each class.

mid: retention days — 30. Set retention to at least 30 days, or the data contract's period. Deleting earlier breaks the retention promise, so declare the minimum.

maximal: delete before retention — false. Set deleting before retention to false. A lifecycle rule that destroys data early cannot be undone, so align expiry with retention.
