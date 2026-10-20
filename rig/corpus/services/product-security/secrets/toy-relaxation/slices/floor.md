# product-security.secrets.toy-relaxation — floor and mutation-floor slice

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade slice `toy-relaxation-slice-floor`: Limit the relaxation to a named disposable scope, such as a local experiment. An open-ended exception becomes permanent, so state the scope.
