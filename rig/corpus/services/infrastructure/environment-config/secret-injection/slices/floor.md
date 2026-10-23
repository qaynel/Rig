# infrastructure.environment-config.secret-injection — floor and mutation-floor slice

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade slice `secret-injection-slice-floor`: List secrets by reference to the authority that holds them. Values in configuration cross the secret boundary, so point to the store.
