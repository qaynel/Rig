# infrastructure.environment-config.secret-injection — maximal

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade, maximal: Set plaintext secret values to false. A literal value in configuration is a leak, so remove it and rotate the secret. Cumulative with minimal and mid. Binding checks: secret-injection-source-code-boundary, secret-injection-environment-config-context, secret-injection-evidence-receipt.

Acceptance target: policy:infrastructure.environment-config.secret-injection:maximal:secret-injection-source-code-boundary+secret-injection-environment-config-context+secret-injection-evidence-receipt.
Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array); secret-injection-environment-config-context: `delivery_mechanism` is nonempty (a string or array); secret-injection-evidence-receipt: `plaintext_secret_values` equals false.
