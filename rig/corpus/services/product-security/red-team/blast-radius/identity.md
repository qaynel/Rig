# product-security.red-team.blast-radius — identity

blast radius owns red-team.blast-radius. Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Keep sibling services in red-team under their own verdicts. Ground the decision in the configured input at `rig-services/product-security.red-team.blast-radius.json`; malformed input is still attributed to that path.

Disposition: convention. Use the limit: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.blast-radius:policy-boundary. Given source-code is present and red-team.blast-radius is selected, pass only when the repository binding evaluates red-team.blast-radius and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.
