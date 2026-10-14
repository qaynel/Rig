# product-security.red-team.auth-session-probe — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for auth session probe; it does not widen ownership beyond red-team.auth-session-probe. For auth session probe, inspect these context signals: protected_routes. Binding checks: auth-session-probe-red-team-context.

Read the existing repository's auth session probe convention, then name the source path or command that establishes it. For auth session probe, inspect the repository's actual spec, source, test, or configuration for protected_routes; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring red-team services outside the auth session probe decision for red-team.auth-session-probe.

Acceptance target: fixture:product-security.red-team.auth-session-probe:repository-context. Given red-team.auth-session-probe has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.
minimal: session cases — ["expiry","logout","revocation"].
mid: protected routes — ["/account"].
maximal: accept revoked session — false.
