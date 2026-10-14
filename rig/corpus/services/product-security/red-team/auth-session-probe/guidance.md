# auth session probe

Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Owned scope: `red-team.auth-session-probe`.

Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Input: `rig-services/product-security.red-team.auth-session-probe.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

minimal: session cases — ["expiry","logout","revocation"].

mid: protected routes — ["/account"].

maximal: accept revoked session — false.

