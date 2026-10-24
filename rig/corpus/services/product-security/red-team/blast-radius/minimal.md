# product-security.red-team.blast-radius — minimal

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Grade: minimal. Assurance remains Policy grade. Example: ["read single tenant"].

Describe the principal’s actual privileges and the enforcement boundary between tenants. The example values are illustrative; the native check cannot verify that enforcement exists.

Catalogue policy target: `policy:product-security.red-team.blast-radius:minimal:blast-radius-source-code-boundary`. This names the policy condition; no runnable attack fixture is included here.
