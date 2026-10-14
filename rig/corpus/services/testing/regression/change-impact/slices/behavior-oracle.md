# testing.regression.change-impact — behavior-oracle slice

Policy grade slice. This slice bounds change impact to regression.change-impact. It uses `change-impact-slice-behavior-oracle` and checks changed_interfaces (nonempty): changed interfaces must name the concrete repository contract..

For change impact, choose a repository example that satisfies changed_interfaces at the behavior-oracle floor, plus a failure where changed interfaces must name the concrete repository contract. is false. For change impact, wire `behavior-oracle` to `rig-services/testing.regression.change-impact.json` and keep its verdict on changed_interfaces; missing evidence is a named gap, with ceiling change impact configuration validation only; declared policy does not prove running change impact behavior. Choose a repository-owned check that observes change impact from rig-services/testing.regression.change-impact.json..

Service-specific evidence cues:
Offer: Trace a change through callers and contracts to determine the affected checks. Filename similarity alone misses downstream behavior and must not become the selection oracle.
minimal: changed interfaces — ["order serializer"].
mid: affected suites — ["order contract"].
maximal: select by filename only — false.
