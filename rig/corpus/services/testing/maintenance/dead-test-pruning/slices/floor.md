# testing.maintenance.dead-test-pruning — floor and mutation-floor slice

Policy grade slice. This slice bounds dead test pruning to maintenance.dead-test-pruning. It uses `dead-test-pruning-slice-floor` and checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract..

For dead test pruning, choose a repository example that satisfies obsolete_cases at the floor and mutation-floor floor, plus a failure where obsolete cases must name the concrete repository contract. is false. For dead test pruning, wire `floor and mutation-floor` to `rig-services/testing.maintenance.dead-test-pruning.json` and keep its verdict on obsolete_cases; missing evidence is a named gap, with ceiling dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Choose a repository-owned check that observes dead test pruning from rig-services/testing.maintenance.dead-test-pruning.json..

Service-specific evidence cues:
Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.
minimal: obsolete cases — ["removed legacy endpoint"].
mid: replacement evidence — ["new endpoint contract passes"].
maximal: delete live regressions — false.
