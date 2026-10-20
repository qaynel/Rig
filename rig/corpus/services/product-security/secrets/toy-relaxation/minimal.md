# product-security.secrets.toy-relaxation — minimal

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for toy relaxation. The minimal boundary for toy relaxation checks toy_scope (nonempty): toy scope must name the concrete repository contract. Binding checks: toy-relaxation-source-code-boundary.

Acceptance target: policy:product-security.secrets.toy-relaxation:minimal:toy-relaxation-source-code-boundary.

Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array).
