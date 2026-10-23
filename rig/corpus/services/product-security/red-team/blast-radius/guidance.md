# Blast-radius boundaries

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Limit the damage a compromised identity can cause by defining its privilege scopes and isolation boundaries. Cross-tenant access violates the intended boundary.

Owned scope: `red-team.blast-radius`. Input: `rig-services/product-security.red-team.blast-radius.json`.

The policy declares minimal `privilege_scopes` = ["read single tenant"]; mid `isolation_boundaries` = ["tenant id enforced"]; maximal `cross_tenant_access` = false. The native rules only check that privilege_scopes and isolation_boundaries are nonempty and cross_tenant_access is false. They do not inspect authorization code or test tenant isolation.

Describe the principal’s actual privileges and the enforcement boundary between tenants. The example values are illustrative; the native check cannot verify that enforcement exists. To establish the boundary, use authorized tests to attempt only the explicitly approved cross-scope access cases and confirm they are denied.

Use isolated test tenants and non-sensitive records; never use production customer data to probe access boundaries.
