# infrastructure.environment-config.secret-injection — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for secret injection; it does not widen ownership beyond runtime-secret-injection, secret-injection-wiring. For secret injection, inspect these context signals: delivery_mechanism. Binding checks: secret-injection-environment-config-context.

Read the existing repository's secret injection convention, then name the source path or command that establishes it. For secret injection, inspect the repository's actual spec, source, test, or configuration for delivery_mechanism; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring environment-config services outside the secret injection decision for runtime-secret-injection, secret-injection-wiring.

Acceptance target: fixture:infrastructure.environment-config.secret-injection:repository-context. Given runtime-secret-injection has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent environment config concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Reference the secret authority and inject through workload identity where available. Declared plaintext values in configuration cross the secret boundary and are rejected.
minimal: secret references — ["vault://app/db"].
mid: delivery mechanism — "workload-identity".
maximal: plaintext secret values — false.
