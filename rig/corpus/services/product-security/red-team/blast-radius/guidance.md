# blast radius

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Owned scope: `red-team.blast-radius`.

Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Input: `rig-services/product-security.red-team.blast-radius.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

minimal: privilege scopes — ["read single tenant"].

mid: isolation boundaries — ["tenant id enforced"].

maximal: cross tenant access — false.

