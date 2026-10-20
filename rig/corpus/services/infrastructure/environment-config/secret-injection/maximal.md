# infrastructure.environment-config.secret-injection — maximal

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: secret-injection-source-code-boundary, secret-injection-environment-config-context, secret-injection-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:infrastructure.environment-config.secret-injection:maximal:secret-injection-source-code-boundary+secret-injection-environment-config-context+secret-injection-evidence-receipt.

Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array); secret-injection-environment-config-context: `delivery_mechanism` is nonempty (a string or array); secret-injection-evidence-receipt: `plaintext_secret_values` equals false.
