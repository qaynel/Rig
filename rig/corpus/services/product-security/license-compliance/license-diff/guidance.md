# license-diff

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Owned scope: `license-compliance.license-diff`. Input: `rig-services/product-security.license-compliance.license-diff.json`.

Coverage ceiling: Configuration validation only, so it confirms previous and current inventories and the auto-accept flag are declared; it does not compute a diff.

minimal: previous inventory — "licenses.previous.json". Provide the previous license inventory for the release. Without a baseline changes cannot be seen, so reference the earlier inventory.

mid: current inventory — "licenses.current.json". Provide the current license inventory. A diff needs both sides, so reference the inventory for this release.

maximal: accept new licenses automatically — false. Set accepting new licenses automatically to false. New or changed obligations need a deliberate disposition, so review each one.
