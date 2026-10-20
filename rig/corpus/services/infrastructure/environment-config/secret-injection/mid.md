# infrastructure.environment-config.secret-injection — mid

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: secret-injection-source-code-boundary, secret-injection-environment-config-context.

Read the existing repository's secret injection convention, then name the source path or command that establishes it. For secret injection, inspect the repository's actual spec, source, test, or configuration for delivery_mechanism; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the secret injection decision for runtime-secret-injection, secret-injection-wiring.

Acceptance target: policy:infrastructure.environment-config.secret-injection:mid:secret-injection-source-code-boundary+secret-injection-environment-config-context.

Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array); secret-injection-environment-config-context: `delivery_mechanism` is nonempty (a string or array).
