# toy-relaxation

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Owned scope: `secrets.toy-relaxation`. Input: `rig-services/product-security.secrets.toy-relaxation.json`.

Coverage ceiling: Configuration validation only, so it confirms toy scope, an expiry and the production-use flag are declared; it does not enforce the expiry.

minimal: toy scope — ["local disposable fixture"]. Limit the relaxation to a named disposable scope, such as a local experiment. An open-ended exception becomes permanent, so state the scope.

mid: expires after days — 1. Set an expiry in days, at least 1. A relaxation without an end date lingers, so state when it lapses.

maximal: permit production use — false. Set permitting production use to false. A toy exception must never reach production or shared customer systems, so keep it local.
