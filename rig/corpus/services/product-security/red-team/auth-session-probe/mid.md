# product-security.red-team.auth-session-probe — mid

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade, mid: List the protected routes the cases hit. Unlisted routes may be public by accident, so name them. Cumulative with minimal. Binding checks: auth-session-probe-source-code-boundary, auth-session-probe-red-team-context.
