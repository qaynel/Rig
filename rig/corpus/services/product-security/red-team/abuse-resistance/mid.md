# product-security.red-team.abuse-resistance — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for abuse resistance; it does not widen ownership beyond red-team.abuse-resistance. For abuse resistance, inspect these context signals: rate_limit_policy. Binding checks: abuse-resistance-red-team-context.

Tie acceptance to the existing repository's abuse resistance convention, then name the source path or command that establishes it. For abuse resistance, inspect the repository's actual spec, source, test, or configuration for rate_limit_policy; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring red-team services outside the abuse resistance decision for red-team.abuse-resistance.

Acceptance target: fixture:product-security.red-team.abuse-resistance:repository-context. Given red-team.abuse-resistance has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.
minimal: abuse cases — ["credential stuffing"].
mid: rate limit policy — "per identity and IP".
maximal: unbounded public requests — false.
