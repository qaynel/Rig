# product-security.secrets.toy-relaxation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for toy relaxation. The evidence must preserve the toy_scope, expires_after_days, permit_production_use inputs that determined the result. Binding checks: toy-relaxation-evidence-receipt.

Inspect a second run against unchanged toy relaxation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.secrets.toy-relaxation:evidence-replay. Given the secrets.toy-relaxation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`.

Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Select an approved repository-owned command to verify that behavior.

minimal: toy scope — ["local disposable fixture"].

mid: expires after days — 1.

maximal: permit production use — false.
