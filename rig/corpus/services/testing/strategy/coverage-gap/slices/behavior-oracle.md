# testing.strategy.coverage-gap — behavior-oracle slice

Policy grade slice. This slice bounds coverage gap to strategy.coverage-gap. It uses `coverage-gap-slice-behavior-oracle` and checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract..

For coverage gap, choose a repository example that satisfies uncovered_behaviors at the behavior-oracle floor, plus a failure where uncovered behaviors must name the concrete repository contract. is false. For coverage gap, wire `behavior-oracle` to `rig-services/testing.strategy.coverage-gap.json` and keep its verdict on uncovered_behaviors; missing evidence is a named gap, with ceiling coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Choose a repository-owned check that observes coverage gap from rig-services/testing.strategy.coverage-gap.json..

Service-specific evidence cues:
Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.
minimal: uncovered behaviors — ["expired token"].
mid: risk owners — ["auth team"].
maximal: claim complete from line coverage — false.
