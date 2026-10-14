# product-security.red-team.abuse-resistance — identity

Policy grade: abuse resistance owns red-team.abuse-resistance. Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Keep neighboring red-team services outside the abuse resistance decision for red-team.abuse-resistance. Trace the verdict to the configured input at `rig-services/product-security.red-team.abuse-resistance.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Choose a repository-owned check that observes abuse resistance from rig-services/product-security.red-team.abuse-resistance.json.

Acceptance target: fixture:product-security.red-team.abuse-resistance:policy-boundary. Given source-code is present and red-team.abuse-resistance is selected, pass only when the repository binding evaluates red-team.abuse-resistance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.
minimal: abuse cases — ["credential stuffing"].
mid: rate limit policy — "per identity and IP".
maximal: unbounded public requests — false.
