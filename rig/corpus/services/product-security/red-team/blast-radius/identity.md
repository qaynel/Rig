# product-security.red-team.blast-radius — identity

Policy grade: blast radius owns red-team.blast-radius. Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Keep neighboring red-team services outside the blast radius decision for red-team.blast-radius. Ground the decision in the configured input at `rig-services/product-security.red-team.blast-radius.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Choose a repository-owned check that observes blast radius from rig-services/product-security.red-team.blast-radius.json.

Acceptance target: fixture:product-security.red-team.blast-radius:policy-boundary. Given source-code is present and red-team.blast-radius is selected, pass only when the repository binding evaluates red-team.blast-radius and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.
minimal: privilege scopes — ["read single tenant"].
mid: isolation boundaries — ["tenant id enforced"].
maximal: cross tenant access — false.
