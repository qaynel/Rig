# product-security.red-team.auth-session-probe — identity

auth session probe owns red-team.auth-session-probe. Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Keep sibling services in red-team under their own verdicts. Anchor the review on the configured input at `rig-services/product-security.red-team.auth-session-probe.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.auth-session-probe:policy-boundary. Given source-code is present and red-team.auth-session-probe is selected, pass only when the repository binding evaluates red-team.auth-session-probe and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
