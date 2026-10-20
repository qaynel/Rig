# toy relaxation

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`.

Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

minimal: toy scope — ["local disposable fixture"].

mid: expires after days — 1.

maximal: permit production use — false.
