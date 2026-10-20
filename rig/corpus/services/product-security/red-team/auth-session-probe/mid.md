# product-security.red-team.auth-session-probe — mid

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: auth-session-probe-source-code-boundary, auth-session-probe-red-team-context.

Choose routes that actually require authentication and cover the invalidation events supported by the application. These checks do not discover routes or session lifecycle behavior. No repository-specific evidence source is supplied by this policy definition, and a nonempty value does not prove that the local boundary has been inspected.

Catalogue policy target: `policy:product-security.red-team.auth-session-probe:mid:auth-session-probe-source-code-boundary+auth-session-probe-red-team-context`. The native rule establishes only that protected_routes is nonempty.
