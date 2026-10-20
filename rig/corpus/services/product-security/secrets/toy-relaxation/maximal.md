# product-security.secrets.toy-relaxation — maximal

Limit any relaxed secret policy to disposable local experiments with an expiry. A toy exception must never extend to production or shared customer systems.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: toy-relaxation-source-code-boundary, toy-relaxation-secrets-context, toy-relaxation-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:product-security.secrets.toy-relaxation:maximal:toy-relaxation-source-code-boundary+toy-relaxation-secrets-context+toy-relaxation-evidence-receipt.

Declared predicates: toy-relaxation-source-code-boundary: `toy_scope` is nonempty (a string or array); toy-relaxation-secrets-context: `expires_after_days` is numeric and at least 1; toy-relaxation-evidence-receipt: `permit_production_use` equals false.
