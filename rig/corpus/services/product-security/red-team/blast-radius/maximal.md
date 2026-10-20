# product-security.red-team.blast-radius — maximal

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade, maximal: Set cross-tenant access to false. Access across tenants defeats the boundary, so deny it. Cumulative with minimal and mid. Binding checks: blast-radius-source-code-boundary, blast-radius-red-team-context, blast-radius-evidence-receipt.
