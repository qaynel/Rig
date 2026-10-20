# product-security.red-team.blast-radius — mid

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade, mid: List the isolation boundaries, such as tenant or network separation. An unnamed boundary is not enforced, so declare it. Cumulative with minimal. Binding checks: blast-radius-source-code-boundary, blast-radius-red-team-context.
