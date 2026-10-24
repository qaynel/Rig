# product-security.red-team.blast-radius — property-floor slice

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade. `blast-radius-slice-property-floor` verifies a configured scope list, not tenant isolation.,The maximal rule rejects `cross_tenant_access: true` in policy data; it does not measure whether the application prevents cross-tenant access.The native check is `blast-radius-slice-property-floor`.

The maximal rule rejects `cross_tenant_access: true` in policy data; it does not measure whether the application prevents cross-tenant access.
