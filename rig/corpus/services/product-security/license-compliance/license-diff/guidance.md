# license diff

Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Owned scope: `license-compliance.license-diff`.

Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Input: `rig-services/product-security.license-compliance.license-diff.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.

minimal: previous inventory — "licenses.previous.json".

mid: current inventory — "licenses.current.json".

maximal: accept new licenses automatically — false.

