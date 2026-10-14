# abuse resistance

Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Owned scope: `red-team.abuse-resistance`.

Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Input: `rig-services/product-security.red-team.abuse-resistance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

minimal: abuse cases — ["credential stuffing"].

mid: rate limit policy — "per identity and IP".

maximal: unbounded public requests — false.

