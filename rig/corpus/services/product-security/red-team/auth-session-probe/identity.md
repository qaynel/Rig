# product-security.red-team.auth-session-probe — identity

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Policy grade. Probe session expiry, logout, and revocation at protected routes. A session cookie can remain present after server-side access should have been revoked.

Applicable surface: source-code. Owned scope: `red-team.auth-session-probe`. Input: `rig-services/product-security.red-team.auth-session-probe.json`.

Disposition: executable. The native checks validate policy configuration only; they do not demonstrate the promised red-team behavior.

The native rules only check nonempty session_cases and protected_routes and require accept_revoked_session=false. They do not make requests or test authentication behavior.

Configured examples: minimal `session_cases` = ["expiry","logout","revocation"]; mid `protected_routes` = ["/account"]; maximal `accept_revoked_session` = false. These are policy values, not results from an attack simulation or runtime probe.
