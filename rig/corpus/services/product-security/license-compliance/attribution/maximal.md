# product-security.license-compliance.attribution — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for attribution. The evidence must preserve the notice_paths, attributed_components, remove_required_notices inputs that determined the result. Binding checks: attribution-evidence-receipt.

Ground the decision in a second run against unchanged attribution inputs. Record the notice_paths, attributed_components, remove_required_notices inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this attribution result is stale. The ceiling remains: attribution configuration validation only; declared policy does not prove running attribution behavior. Choose a repository-owned check that observes attribution from rig-services/product-security.license-compliance.attribution.json.

Acceptance target: fixture:product-security.license-compliance.attribution:evidence-replay. Given the license-compliance.attribution binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Retain the required notices for redistributed third-party components and keep attribution tied to the inventory. A license label cannot replace a required copyright notice.
minimal: notice paths — ["THIRD_PARTY_NOTICES"].
mid: attributed components — ["library@1.0.0"].
maximal: remove required notices — false.
