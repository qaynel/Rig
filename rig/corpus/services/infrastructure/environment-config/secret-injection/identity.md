# infrastructure.environment-config.secret-injection — identity

Policy grade: secret injection owns runtime-secret-injection, secret-injection-wiring. Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Keep neighboring environment-config services outside the secret injection decision for runtime-secret-injection, secret-injection-wiring. Anchor the review on the configured input at `rig-services/infrastructure.environment-config.secret-injection.json`; malformed input is still attributed to that path.

Disposition: executable. Inspect the limit: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Choose a repository-owned check that observes secret injection from rig-services/infrastructure.environment-config.secret-injection.json.

Acceptance target: policy:infrastructure.environment-config.secret-injection:minimal:secret-injection-source-code-boundary.

Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array).
