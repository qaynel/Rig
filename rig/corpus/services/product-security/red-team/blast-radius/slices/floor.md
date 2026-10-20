# product-security.red-team.blast-radius — floor slice

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade. `blast-radius-slice-floor` requires configured `privilege_scopes`. It does not inspect role assignments or authorization code.,Name the identity and allowed actions precisely; later compare those declarations against actual access-control rules. Both floor and mutation-floor map to this configuration rule (blast-radius-slice-floor and blast-radius-slice-mutation-floor); the latter name does not indicate runtime mutation.

Name the identity and allowed actions precisely; later compare those declarations against actual access-control rules.
