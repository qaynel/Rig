# product-security.red-team.abuse-resistance — identity

Policy grade: abuse resistance owns red-team.abuse-resistance. Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Keep sibling services in red-team under their own verdicts. Trace the verdict to the configured input at `rig-services/product-security.red-team.abuse-resistance.json`; malformed input is still attributed to that path.

Disposition: convention. Anchor the review on the limit: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.abuse-resistance:policy-boundary. Given source-code is present and red-team.abuse-resistance is selected, pass only when the repository binding evaluates red-team.abuse-resistance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern.

Service-specific evidence cues:
Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Owned scope: `red-team.abuse-resistance`.

Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Input: `rig-services/product-security.red-team.abuse-resistance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

minimal: abuse cases — ["credential stuffing"].

mid: rate limit policy — "per identity and IP".

maximal: unbounded public requests — false.
