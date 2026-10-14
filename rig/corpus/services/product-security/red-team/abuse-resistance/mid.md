# product-security.red-team.abuse-resistance — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for abuse resistance; it does not widen ownership beyond red-team.abuse-resistance. The context signals are rate_limit_policy. Binding checks: abuse-resistance-red-team-context.

Tie acceptance to the existing repository's abuse resistance convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in red-team under their own verdicts.

Acceptance target: fixture:product-security.red-team.abuse-resistance:repository-context. Given red-team.abuse-resistance has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent red team concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Owned scope: `red-team.abuse-resistance`.

Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Input: `rig-services/product-security.red-team.abuse-resistance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

minimal: abuse cases — ["credential stuffing"].

mid: rate limit policy — "per identity and IP".

maximal: unbounded public requests — false.
