# product-security.red-team.auth-session-probe — floor slice

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade. The `auth-session-probe-slice-floor` rule requires configured session cases such as expiry, logout, or revocation. It does not make a request or invalidate a session.,Use a test account and identify which protected routes must deny access after each invalidation event.

Use a test account and identify which protected routes must deny access after each invalidation event.
