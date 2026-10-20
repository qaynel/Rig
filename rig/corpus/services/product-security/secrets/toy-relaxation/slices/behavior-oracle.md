# product-security.secrets.toy-relaxation — behavior-oracle slice

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade slice `toy-relaxation-slice-behavior-oracle`: Limit the relaxation to a named disposable scope, such as a local experiment. An open-ended exception becomes permanent, so state the scope. Despite its name this slice is not a behavior oracle: it confirms toy scope, an expiry and the production-use flag are declared; it does not enforce the expiry.
