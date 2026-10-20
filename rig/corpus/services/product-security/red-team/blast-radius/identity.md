# product-security.red-team.blast-radius — identity

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade. Limit the damage a compromised identity can cause by defining its privilege scopes and isolation boundaries. Cross-tenant access violates the intended boundary.

Applicable surface: source-code. Owned scope: `red-team.blast-radius`.

Disposition: executable. The native checks validate policy configuration only; they do not demonstrate the promised red-team behavior.

The native rules only check that privilege_scopes and isolation_boundaries are nonempty and cross_tenant_access is false. They do not inspect authorization code or test tenant isolation.

Configured examples: minimal `privilege_scopes` = ["read single tenant"]; mid `isolation_boundaries` = ["tenant id enforced"]; maximal `cross_tenant_access` = false.
