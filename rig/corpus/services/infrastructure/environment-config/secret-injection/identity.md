# infrastructure.environment-config.secret-injection — identity

Policy grade: secret injection owns runtime-secret-injection, secret-injection-wiring. Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Keep sibling services in environment-config under their own verdicts. Anchor the review on the configured input at `rig-services/infrastructure.environment-config.secret-injection.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:policy-boundary. Given source-code is present and runtime-secret-injection is selected, pass only when the repository binding evaluates runtime-secret-injection and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent environment config concern.

Service-specific evidence cues:
Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Owned scope: `runtime-secret-injection`, `secret-injection-wiring`.

Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Input: `rig-services/infrastructure.environment-config.secret-injection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret references — ["vault://app/db"].

mid: delivery mechanism — "workload-identity".

maximal: plaintext secret values — false.
