# secret-injection

Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Owned scope: `runtime-secret-injection, secret-injection-wiring`. Input: `rig-services/infrastructure.environment-config.secret-injection.json`.

Coverage ceiling: Configuration validation only, so it confirms secret references, the delivery mechanism and the plaintext flag are declared; it does not read any secret store.

minimal: secret references — ["vault://app/db"]. List secrets by reference to the authority that holds them. Values in configuration cross the secret boundary, so point to the store.

mid: delivery mechanism — "workload-identity". Declare how secrets reach the workload, such as workload identity. An undefined path invites plaintext files, so name the mechanism.

maximal: plaintext secret values — false. Set plaintext secret values to false. A literal value in configuration is a leak, so remove it and rotate the secret.
