# product-security.license-compliance.license-diff — property-floor slice

Policy grade slice. This slice bounds license diff to license-compliance.license-diff. It uses `license-diff-slice-property-floor` and checks previous_inventory (nonempty): previous inventory must name the concrete repository contract..

Start from a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.license-diff.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Owned scope: `license-compliance.license-diff`.

Offer: Compare license inventories across the actual release change. New or changed obligations require a deliberate disposition before the update is accepted.

Input: `rig-services/product-security.license-compliance.license-diff.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: license diff configuration validation only; declared policy does not prove running license diff behavior. Select an approved repository-owned command to verify that behavior.

minimal: previous inventory — "licenses.previous.json".

mid: current inventory — "licenses.current.json".

maximal: accept new licenses automatically — false.
