# product-security.secrets.toy-relaxation — property-floor slice

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade slice. This slice bounds toy relaxation to secrets.toy-relaxation. It uses `toy-relaxation-slice-property-floor` and checks toy_scope (nonempty): toy scope must name the concrete repository contract.