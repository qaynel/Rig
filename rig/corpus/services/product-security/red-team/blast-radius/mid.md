# product-security.red-team.blast-radius — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for blast radius; it does not widen ownership beyond red-team.blast-radius. For blast radius, inspect these context signals: isolation_boundaries. Binding checks: blast-radius-red-team-context.

Trace the verdict to the existing repository's blast radius convention, then name the source path or command that establishes it. For blast radius, inspect the repository's actual spec, source, test, or configuration for isolation_boundaries; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring red-team services outside the blast radius decision for red-team.blast-radius.

Acceptance target: fixture:product-security.red-team.blast-radius:repository-context. Given red-team.blast-radius has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Bound the damage from a compromised identity with explicit privilege and isolation scopes. Cross-tenant access defeats the intended blast-radius boundary.
minimal: privilege scopes — ["read single tenant"].
mid: isolation boundaries — ["tenant id enforced"].
maximal: cross tenant access — false.
