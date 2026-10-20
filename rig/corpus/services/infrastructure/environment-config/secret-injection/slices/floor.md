# infrastructure.environment-config.secret-injection — floor and mutation-floor slice

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade slice. This slice bounds secret injection to runtime-secret-injection, secret-injection-wiring. It uses `secret-injection-slice-floor` and checks secret_references (nonempty): secret references must name the concrete repository contract.