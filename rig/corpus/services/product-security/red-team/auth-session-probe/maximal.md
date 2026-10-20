# product-security.red-team.auth-session-probe — maximal

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: auth-session-probe-source-code-boundary, auth-session-probe-red-team-context, auth-session-probe-evidence-receipt.

The native rules only check nonempty session_cases and protected_routes and require accept_revoked_session=false. They do not make requests or test authentication behavior. For runtime assurance, test each declared case against each protected route: valid sessions retain intended access; expired, logged-out, and revoked sessions do not.

Catalogue policy target: `policy:product-security.red-team.auth-session-probe:maximal:auth-session-probe-source-code-boundary+auth-session-probe-red-team-context+auth-session-probe-evidence-receipt`. Its current rule proves only that accept_revoked_session equals false. It does not run or replay a red-team test.
