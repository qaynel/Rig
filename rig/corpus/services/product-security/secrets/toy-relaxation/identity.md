# product-security.secrets.toy-relaxation — identity

Policy grade: toy-relaxation owns secrets.toy-relaxation. Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Input: `rig-services/product-security.secrets.toy-relaxation.json`. Configuration validation only, so it confirms toy scope, an expiry and the production-use flag are declared; it does not enforce the expiry.

Disposition: executable.
Acceptance target: policy:product-security.secrets.toy-relaxation:minimal:toy-relaxation-source-code-boundary.
Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array).
