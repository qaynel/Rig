# infrastructure.environment-config.secret-injection — minimal

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade, minimal: List secrets by reference to the authority that holds them. Values in configuration cross the secret boundary, so point to the store. Binding checks: secret-injection-source-code-boundary.

Acceptance target: policy:infrastructure.environment-config.secret-injection:minimal:secret-injection-source-code-boundary.
Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array).
