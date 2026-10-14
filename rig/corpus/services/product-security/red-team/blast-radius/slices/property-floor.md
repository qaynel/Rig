# product-security.red-team.blast-radius — property-floor slice

Policy grade slice. This slice bounds blast radius to red-team.blast-radius. It uses `blast-radius-slice-property-floor` and checks privilege_scopes (nonempty): privilege scopes must name the concrete repository contract..

Tie acceptance to a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/product-security.red-team.blast-radius.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Owned scope: `red-team.blast-radius`.

Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Input: `rig-services/product-security.red-team.blast-radius.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

minimal: privilege scopes — ["read single tenant"].

mid: isolation boundaries — ["tenant id enforced"].

maximal: cross tenant access — false.
