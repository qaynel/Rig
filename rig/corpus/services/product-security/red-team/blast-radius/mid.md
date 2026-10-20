# product-security.red-team.blast-radius — mid

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: blast-radius-source-code-boundary, blast-radius-red-team-context.

Describe the principal’s actual privileges and the enforcement boundary between tenants. The example values are illustrative; the native check cannot verify that enforcement exists. No repository-specific evidence source is supplied by this policy definition, and a nonempty value does not prove that the local boundary has been inspected.

Catalogue policy target: `policy:product-security.red-team.blast-radius:mid:blast-radius-source-code-boundary+blast-radius-red-team-context`. The native rule establishes only that isolation_boundaries is nonempty.
