# product-security.red-team.auth-session-probe — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for auth session probe. It checks session_cases (nonempty): session cases must name the concrete repository contract.. Binding checks: auth-session-probe-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe red-team.auth-session-probe; bind it to the input named in `rig-services/product-security.red-team.auth-session-probe.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.auth-session-probe is a failure.

Acceptance target: fixture:product-security.red-team.auth-session-probe:policy-boundary. Given source-code is present and red-team.auth-session-probe is selected, pass only when the repository binding evaluates red-team.auth-session-probe and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Owned scope: `red-team.auth-session-probe`.

Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Input: `rig-services/product-security.red-team.auth-session-probe.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

minimal: session cases — ["expiry","logout","revocation"].

mid: protected routes — ["/account"].

maximal: accept revoked session — false.
