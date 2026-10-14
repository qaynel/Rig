# product-security.red-team.blast-radius — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for blast radius. The evidence must preserve the privilege_scopes, isolation_boundaries, cross_tenant_access inputs that determined the result. Binding checks: blast-radius-evidence-receipt.

Anchor the review on a second run against unchanged blast radius inputs. Record the privilege_scopes, isolation_boundaries, cross_tenant_access inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this blast radius result is stale. The ceiling remains: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Choose a repository-owned check that observes blast radius from rig-services/product-security.red-team.blast-radius.json.

Acceptance target: fixture:product-security.red-team.blast-radius:evidence-replay. Given the red-team.blast-radius binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.
minimal: privilege scopes — ["read single tenant"].
mid: isolation boundaries — ["tenant id enforced"].
maximal: cross tenant access — false.
