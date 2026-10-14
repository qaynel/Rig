# product-security.red-team.blast-radius — behavior-oracle slice

Policy grade slice. This slice bounds blast radius to red-team.blast-radius. It uses `blast-radius-slice-behavior-oracle` and checks privilege_scopes (nonempty): privilege scopes must name the concrete repository contract..

For blast radius, choose a repository example that satisfies privilege_scopes at the behavior-oracle floor, plus a failure where privilege scopes must name the concrete repository contract. is false. For blast radius, wire `behavior-oracle` to `rig-services/product-security.red-team.blast-radius.json` and keep its verdict on privilege_scopes; missing evidence is a named gap, with ceiling blast radius configuration validation only; declared policy does not prove running blast radius behavior. Choose a repository-owned check that observes blast radius from rig-services/product-security.red-team.blast-radius.json..

Service-specific evidence cues:
Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.
minimal: privilege scopes — ["read single tenant"].
mid: isolation boundaries — ["tenant id enforced"].
maximal: cross tenant access — false.
