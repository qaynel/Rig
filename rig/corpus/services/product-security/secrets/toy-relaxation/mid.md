# product-security.secrets.toy-relaxation — mid

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade, mid: Set an expiry in days, at least 1. A relaxation without an end date lingers, so state when it lapses. Cumulative with minimal. Binding checks: toy-relaxation-source-code-boundary, toy-relaxation-secrets-context.

Acceptance target: policy:product-security.secrets.toy-relaxation:mid:toy-relaxation-source-code-boundary+toy-relaxation-secrets-context.
Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array); toy-relaxation-secrets-context: `expires_after_days` is numeric and at least 1.
