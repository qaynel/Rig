# product-security.secrets.toy-relaxation — property-floor slice

Policy grade slice. This slice bounds toy relaxation to secrets.toy-relaxation. It uses `toy-relaxation-slice-property-floor` and checks toy_scope (nonempty): toy scope must name the concrete repository contract..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.secrets.toy-relaxation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`.

Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

minimal: toy scope — ["local disposable fixture"].

mid: expires after days — 1.

maximal: permit production use — false.
