# product-security.license-compliance.attribution — property-floor slice

Policy grade slice. This slice bounds attribution to license-compliance.attribution. It uses `attribution-slice-property-floor` and checks notice_paths (nonempty): notice paths must name the concrete repository contract..

Start from a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.license-compliance.attribution.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`.

Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

minimal: notice paths — ["THIRD_PARTY_NOTICES"].

mid: attributed components — ["library@1.0.0"].

maximal: remove required notices — false.
