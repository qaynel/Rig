# attribution

Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`.

Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

minimal: notice paths — ["THIRD_PARTY_NOTICES"].

mid: attributed components — ["library@1.0.0"].

maximal: remove required notices — false.

