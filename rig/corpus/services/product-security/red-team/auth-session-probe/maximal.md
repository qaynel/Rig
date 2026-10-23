# product-security.red-team.auth-session-probe — maximal

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade, maximal: Set accepting a revoked session to false. A revoked or expired session must lose access even if its cookie exists, so enforce invalidation. Cumulative with minimal and mid. Binding checks: auth-session-probe-source-code-boundary, auth-session-probe-red-team-context, auth-session-probe-evidence-receipt.
