# infrastructure.environment-config.secret-injection — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for secret injection; it does not widen ownership beyond runtime-secret-injection, secret-injection-wiring. The context signals are delivery_mechanism. Binding checks: secret-injection-environment-config-context.

Read the existing repository's secret injection convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in environment-config under their own verdicts.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:repository-context. Given runtime-secret-injection has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Owned scope: `runtime-secret-injection`, `secret-injection-wiring`.

Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.

Input: `rig-services/infrastructure.environment-config.secret-injection.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: secret injection configuration validation only; declared policy does not prove running secret injection behavior. Select an approved repository-owned command to verify that behavior.

minimal: secret references — ["vault://app/db"].

mid: delivery mechanism — "workload-identity".

maximal: plaintext secret values — false.
