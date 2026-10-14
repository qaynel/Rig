# product-security.red-team.abuse-resistance — behavior-oracle slice

Policy grade slice. This slice bounds abuse resistance to red-team.abuse-resistance. It uses `abuse-resistance-slice-behavior-oracle` and checks abuse_cases (nonempty): abuse cases must name the concrete repository contract..

For abuse resistance, choose a repository example that satisfies abuse_cases at the behavior-oracle floor, plus a failure where abuse cases must name the concrete repository contract. is false. For abuse resistance, wire `behavior-oracle` to `rig-services/product-security.red-team.abuse-resistance.json` and keep its verdict on abuse_cases; missing evidence is a named gap, with ceiling abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Choose a repository-owned check that observes abuse resistance from rig-services/product-security.red-team.abuse-resistance.json..

Service-specific evidence cues:
Offer: Model misuse and enforce bounded access at the relevant public boundary. A documented limit needs separate live evidence before it can claim effective abuse resistance.
minimal: abuse cases — ["credential stuffing"].
mid: rate limit policy — "per identity and IP".
maximal: unbounded public requests — false.
