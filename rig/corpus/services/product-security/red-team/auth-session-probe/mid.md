# product-security.red-team.auth-session-probe — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for auth session probe; it does not widen ownership beyond red-team.auth-session-probe. The context signals are protected_routes. Binding checks: auth-session-probe-red-team-context.

Read the existing repository's auth session probe convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.auth-session-probe:repository-context. Given red-team.auth-session-probe has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Owned scope: `red-team.auth-session-probe`.

Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.

Input: `rig-services/product-security.red-team.auth-session-probe.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Select an approved repository-owned command to verify that behavior.

minimal: session cases — ["expiry","logout","revocation"].

mid: protected routes — ["/account"].

maximal: accept revoked session — false.
