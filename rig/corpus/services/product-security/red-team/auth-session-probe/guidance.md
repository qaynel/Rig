# Authentication session probe

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Probe session expiry, logout, and revocation at protected routes. A session cookie can remain present after server-side access should have been revoked.

Owned scope: `red-team.auth-session-probe`. Input: `rig-services/product-security.red-team.auth-session-probe.json`.

The policy declares minimal `session_cases` = ["expiry","logout","revocation"]; mid `protected_routes` = ["/account"]; maximal `accept_revoked_session` = false. The native rules only check nonempty session_cases and protected_routes and require accept_revoked_session=false. They do not make requests or test authentication behavior.

Choose routes that actually require authentication and cover the invalidation events supported by the application. These checks do not discover routes or session lifecycle behavior. For runtime assurance, test each declared case against each protected route: valid sessions retain intended access; expired, logged-out, and revoked sessions do not.

Use a test account and non-production environment; never probe another user’s session.
