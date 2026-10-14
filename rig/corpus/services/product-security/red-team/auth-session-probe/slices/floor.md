# product-security.red-team.auth-session-probe — floor and mutation-floor slice

Policy grade slice. This slice bounds auth session probe to red-team.auth-session-probe. It uses `auth-session-probe-slice-floor` and checks session_cases (nonempty): session cases must name the concrete repository contract..

For auth session probe, choose a repository example that satisfies session_cases at the floor and mutation-floor floor, plus a failure where session cases must name the concrete repository contract. is false. For auth session probe, wire `floor and mutation-floor` to `rig-services/product-security.red-team.auth-session-probe.json` and keep its verdict on session_cases; missing evidence is a named gap, with ceiling auth session probe configuration validation only; declared policy does not prove running auth session probe behavior. Choose a repository-owned check that observes auth session probe from rig-services/product-security.red-team.auth-session-probe.json..

Service-specific evidence cues:
Offer: Probe session invalidation and protected-route behavior, not merely successful login. A revoked or expired session must lose access even when its cookie still exists.
minimal: session cases — ["expiry","logout","revocation"].
mid: protected routes — ["/account"].
maximal: accept revoked session — false.
