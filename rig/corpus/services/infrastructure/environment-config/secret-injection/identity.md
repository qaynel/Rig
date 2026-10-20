# infrastructure.environment-config.secret-injection — identity

Policy grade: secret-injection owns runtime-secret-injection, secret-injection-wiring. Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Input: `rig-services/infrastructure.environment-config.secret-injection.json`. Configuration validation only, so it confirms secret references, the delivery mechanism and the plaintext flag are declared; it does not read any secret store.

Disposition: executable.
Acceptance target: policy:infrastructure.environment-config.secret-injection:minimal:secret-injection-source-code-boundary.
Declared predicates: secret-injection-source-code-boundary: `secret_references` is nonempty (a string or array).
