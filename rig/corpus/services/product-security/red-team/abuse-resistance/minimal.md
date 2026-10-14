# product-security.red-team.abuse-resistance — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for abuse resistance. The minimal boundary for abuse resistance checks abuse_cases (nonempty): abuse cases must name the concrete repository contract.. Binding checks: abuse-resistance-source-code-boundary.

Inspect a repository-owned command or existing native check that can observe red-team.abuse-resistance; bind it to the input named in `rig-services/product-security.red-team.abuse-resistance.json` and preserve the check's failure status. When adopting this in an existing repository, connect abuse resistance to the command that inspects abuse_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside red-team.abuse-resistance as a failure.

Acceptance target: fixture:product-security.red-team.abuse-resistance:policy-boundary. Given source-code is present and red-team.abuse-resistance is selected, pass only when the repository binding evaluates red-team.abuse-resistance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent red team concern. The ceiling is abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Choose a repository-owned check that observes abuse resistance from rig-services/product-security.red-team.abuse-resistance.json..

Service-specific evidence cues:
Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.
minimal: abuse cases — ["credential stuffing"].
mid: rate limit policy — "per identity and IP".
maximal: unbounded public requests — false.
