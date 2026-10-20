# infrastructure.environment-config.secret-injection — behavior-oracle slice

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Policy grade slice `secret-injection-slice-behavior-oracle`: List secrets by reference to the authority that holds them. Values in configuration cross the secret boundary, so point to the store. Despite its name this slice is not a behavior oracle: it confirms secret references, the delivery mechanism and the plaintext flag are declared; it does not read any secret store.
