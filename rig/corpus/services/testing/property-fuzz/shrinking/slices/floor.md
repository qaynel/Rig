# testing.property-fuzz.shrinking — floor and mutation-floor slice

Policy grade slice. This slice bounds shrinking to property-fuzz.shrinking. It uses `shrinking-slice-floor` and checks failure_predicate (nonempty): failure predicate must name the concrete repository contract..

For shrinking, choose a repository example that satisfies failure_predicate at the floor and mutation-floor floor, plus a failure where failure predicate must name the concrete repository contract. is false. For shrinking, wire `floor and mutation-floor` to `rig-services/testing.property-fuzz.shrinking.json` and keep its verdict on failure_predicate; missing evidence is a named gap, with ceiling shrinking configuration validation only; declared policy does not prove running shrinking behavior. Choose a repository-owned check that observes shrinking from rig-services/testing.property-fuzz.shrinking.json..

Service-specific evidence cues:
Offer: Reduce a failing input while preserving both the failure and the relevant domain constraints. A smaller case that no longer triggers the defect is not a useful shrink result.
minimal: failure predicate — "parser crashes".
mid: preserved constraints — ["valid UTF-8"].
maximal: drop failure during shrink — false.
