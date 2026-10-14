# product-security.red-team.blast-radius — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for blast radius; it does not widen ownership beyond red-team.blast-radius. The context signals are isolation_boundaries. Binding checks: blast-radius-red-team-context.

Trace the verdict to the existing repository's blast radius convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.blast-radius:repository-context. Given red-team.blast-radius has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Owned scope: `red-team.blast-radius`.

Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.

Input: `rig-services/product-security.red-team.blast-radius.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: blast radius configuration validation only; declared policy does not prove running blast radius behavior. Select an approved repository-owned command to verify that behavior.

minimal: privilege scopes — ["read single tenant"].

mid: isolation boundaries — ["tenant id enforced"].

maximal: cross tenant access — false.
