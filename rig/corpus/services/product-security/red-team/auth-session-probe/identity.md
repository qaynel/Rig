# product-security.red-team.auth-session-probe — identity

Policy grade: auth session probe owns red-team.auth-session-probe. Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Keep neighboring red-team services outside the auth session probe decision for red-team.auth-session-probe. Anchor the review on the configured input at `rig-services/product-security.red-team.auth-session-probe.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Choose a repository-owned check that observes auth session probe from rig-services/product-security.red-team.auth-session-probe.json.

Acceptance target: fixture:product-security.red-team.auth-session-probe:policy-boundary. Given source-code is present and red-team.auth-session-probe is selected, pass only when the repository binding evaluates red-team.auth-session-probe and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.
minimal: session cases — ["expiry","logout","revocation"].
mid: protected routes — ["/account"].
maximal: accept revoked session — false.
