# product-security.red-team.abuse-resistance — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for abuse resistance. It checks abuse_cases (nonempty): abuse cases must name the concrete repository contract.. Binding checks: abuse-resistance-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe red-team.abuse-resistance; bind it to the input named in `rig-services/product-security.red-team.abuse-resistance.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside red-team.abuse-resistance is a failure.

Acceptance target: fixture:product-security.red-team.abuse-resistance:policy-boundary. Given source-code is present and red-team.abuse-resistance is selected, pass only when the repository binding evaluates red-team.abuse-resistance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Owned scope: `red-team.abuse-resistance`.

Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.

Input: `rig-services/product-security.red-team.abuse-resistance.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

minimal: abuse cases — ["credential stuffing"].

mid: rate limit policy — "per identity and IP".

maximal: unbounded public requests — false.
