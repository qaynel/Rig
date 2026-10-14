# product-security.secrets.toy-relaxation — identity

Policy grade: toy relaxation owns secrets.toy-relaxation. Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Keep sibling services in secrets under their own verdicts. Use the configured input at `rig-services/product-security.secrets.toy-relaxation.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.toy-relaxation:policy-boundary. Given source-code is present and secrets.toy-relaxation is selected, pass only when the repository binding evaluates secrets.toy-relaxation and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent secrets concern.

Service-specific evidence cues:
Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`.

Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

minimal: toy scope — ["local disposable fixture"].

mid: expires after days — 1.

maximal: permit production use — false.
