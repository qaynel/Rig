# product-security.red-team.blast-radius — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for blast radius. The evidence must preserve the privilege_scopes, isolation_boundaries, cross_tenant_access inputs that determined the result. Binding checks: blast-radius-evidence-receipt.

Anchor the review on a second run against unchanged blast radius inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.blast-radius:evidence-replay. Given the red-team.blast-radius binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Owned scope: `red-team.blast-radius`.

Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Input: `rig-services/product-security.red-team.blast-radius.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

minimal: privilege scopes — ["read single tenant"].

mid: isolation boundaries — ["tenant id enforced"].

maximal: cross tenant access — false.
