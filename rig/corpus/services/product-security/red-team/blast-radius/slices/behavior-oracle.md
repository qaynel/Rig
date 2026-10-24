# product-security.red-team.blast-radius — behavior-oracle slice

Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Policy grade. The behavior-oracle slice checks a nonempty privilege-scope field only. It cannot show that an identity is constrained to that scope.,A runtime boundary test needs explicitly approved test identities and tenants, then must verify that cross-scope requests are rejected.The native check is `blast-radius-slice-behavior-oracle`.

A runtime boundary test needs explicitly approved test identities and tenants, then must verify that cross-scope requests are rejected.
