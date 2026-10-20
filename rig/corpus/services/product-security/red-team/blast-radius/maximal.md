# product-security.red-team.blast-radius — maximal

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: blast-radius-source-code-boundary, blast-radius-red-team-context, blast-radius-evidence-receipt.

The native rules only check that privilege_scopes and isolation_boundaries are nonempty and cross_tenant_access is false. They do not inspect authorization code or test tenant isolation. To establish the boundary, use authorized tests to attempt only the explicitly approved cross-scope access cases and confirm they are denied.

Catalogue policy target: `policy:product-security.red-team.blast-radius:maximal:blast-radius-source-code-boundary+blast-radius-red-team-context+blast-radius-evidence-receipt`. Its current rule proves only that cross_tenant_access equals false. It does not run or replay a red-team test.
