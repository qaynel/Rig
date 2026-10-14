# product-security.license-compliance.attribution — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for attribution. The evidence must preserve the notice_paths, attributed_components, remove_required_notices inputs that determined the result. Binding checks: attribution-evidence-receipt.

Ground the decision in a second run against unchanged attribution inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.license-compliance.attribution:evidence-replay. Given the license-compliance.attribution binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Owned scope: `license-compliance.attribution`.

Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.

Input: `rig-services/product-security.license-compliance.attribution.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: attribution configuration validation only; declared policy does not prove running attribution behavior. Select an approved repository-owned command to verify that behavior.

minimal: notice paths — ["THIRD_PARTY_NOTICES"].

mid: attributed components — ["library@1.0.0"].

maximal: remove required notices — false.
