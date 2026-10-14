# infrastructure.environment-config.secret-injection — floor and mutation-floor slice

Policy grade slice. This slice bounds secret injection to runtime-secret-injection, secret-injection-wiring. It uses `secret-injection-slice-floor` and checks secret_references (nonempty): secret references must name the concrete repository contract..

For secret injection, choose a repository example that satisfies secret_references at the floor and mutation-floor floor, plus a failure where secret references must name the concrete repository contract. is false. For secret injection, wire `floor and mutation-floor` to `rig-services/infrastructure.environment-config.secret-injection.json` and keep its verdict on secret_references; missing evidence is a named gap, with ceiling secret injection configuration validation only; declared policy does not prove running secret injection behavior. Choose a repository-owned check that observes secret injection from rig-services/infrastructure.environment-config.secret-injection.json..

Service-specific evidence cues:
Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.
minimal: secret references — ["vault://app/db"].
mid: delivery mechanism — "workload-identity".
maximal: plaintext secret values — false.
