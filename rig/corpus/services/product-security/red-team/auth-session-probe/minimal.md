# product-security.red-team.auth-session-probe — minimal

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Grade: minimal. Assurance remains Policy grade. `auth-session-probe-source-code-boundary` checks that `session_cases` is nonempty. Example: ["expiry","logout","revocation"].

Choose routes that actually require authentication and cover the invalidation events supported by the application. These checks do not discover routes or session lifecycle behavior. The rule proves only that a value was configured.

Catalogue policy target: `policy:product-security.red-team.auth-session-probe:minimal:auth-session-probe-source-code-boundary`. This names the policy condition; no runnable attack fixture is included here.
