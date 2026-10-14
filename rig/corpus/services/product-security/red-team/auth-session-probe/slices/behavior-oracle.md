# product-security.red-team.auth-session-probe — behavior-oracle slice

Policy grade slice. This slice bounds auth session probe to red-team.auth-session-probe. It uses `auth-session-probe-slice-behavior-oracle` and checks session_cases (nonempty): session cases must name the concrete repository contract..

Start from a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.auth-session-probe.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Owned scope: `red-team.auth-session-probe`.

Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Input: `rig-services/product-security.red-team.auth-session-probe.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

minimal: session cases — ["expiry","logout","revocation"].

mid: protected routes — ["/account"].

maximal: accept revoked session — false.
