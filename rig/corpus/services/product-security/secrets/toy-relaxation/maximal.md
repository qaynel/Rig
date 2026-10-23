# product-security.secrets.toy-relaxation — maximal

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Policy grade, maximal: Set permitting production use to false. A toy exception must never reach production or shared customer systems, so keep it local. Cumulative with minimal and mid. Binding checks: toy-relaxation-source-code-boundary, toy-relaxation-secrets-context, toy-relaxation-evidence-receipt.

Acceptance target: policy:product-security.secrets.toy-relaxation:maximal:toy-relaxation-source-code-boundary+toy-relaxation-secrets-context+toy-relaxation-evidence-receipt.
Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array); toy-relaxation-secrets-context: `expires_after_days` is numeric and at least 1; toy-relaxation-evidence-receipt: `permit_production_use` equals false.
