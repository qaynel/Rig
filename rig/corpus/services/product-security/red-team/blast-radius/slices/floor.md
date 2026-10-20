# product-security.red-team.blast-radius — floor slice

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade. `blast-radius-slice-floor` requires configured `privilege_scopes`. It does not inspect role assignments or authorization code.,Name the identity and allowed actions precisely; later compare those declarations against actual access-control rules.

Name the identity and allowed actions precisely; later compare those declarations against actual access-control rules.
