# product-security.secrets.toy-relaxation — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for toy relaxation. The evidence must preserve the toy_scope, expires_after_days, permit_production_use inputs that determined the result. Binding checks: toy-relaxation-evidence-receipt.

Inspect a second run against unchanged toy relaxation inputs. Record the toy_scope, expires_after_days, permit_production_use inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this toy relaxation result is stale. The ceiling remains: toy relaxation configuration validation only; declared policy does not prove running toy relaxation behavior. Choose a repository-owned check that observes toy relaxation from rig-services/product-security.secrets.toy-relaxation.json.

Acceptance target: fixture:product-security.secrets.toy-relaxation:evidence-replay. Given the secrets.toy-relaxation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.
minimal: toy scope — ["local disposable fixture"].
mid: expires after days — 1.
maximal: permit production use — false.
