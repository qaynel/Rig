# infrastructure.environment-config.secret-injection — mid

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade, mid: Declare how secrets reach the workload, such as workload identity. An undefined path invites plaintext files, so name the mechanism. Cumulative with minimal. Binding checks: secret-injection-source-code-boundary, secret-injection-environment-config-context.

Acceptance target: policy:infrastructure.environment-config.secret-injection:mid:secret-injection-source-code-boundary+secret-injection-environment-config-context.
Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array); secret-injection-environment-config-context: `delivery_mechanism` is nonempty (a string or array).
