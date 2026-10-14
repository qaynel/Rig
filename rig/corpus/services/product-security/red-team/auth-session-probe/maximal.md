# product-security.red-team.auth-session-probe — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for auth session probe. The evidence must preserve the session_cases, protected_routes, accept_revoked_session inputs that determined the result. Binding checks: auth-session-probe-evidence-receipt.

Ground the decision in a second run against unchanged auth session probe inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.auth-session-probe:evidence-replay. Given the red-team.auth-session-probe binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Owned scope: `red-team.auth-session-probe`.

Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Input: `rig-services/product-security.red-team.auth-session-probe.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

minimal: session cases — ["expiry","logout","revocation"].

mid: protected routes — ["/account"].

maximal: accept revoked session — false.
