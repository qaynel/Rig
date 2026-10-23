# product-security.secrets.toy-relaxation — minimal

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade, minimal: Limit the relaxation to a named disposable scope, such as a local experiment. An open-ended exception becomes permanent, so state the scope. Binding checks: toy-relaxation-source-code-boundary.

Acceptance target: policy:product-security.secrets.toy-relaxation:minimal:toy-relaxation-source-code-boundary.
Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array).
