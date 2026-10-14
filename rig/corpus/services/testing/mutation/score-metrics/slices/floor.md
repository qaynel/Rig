# testing.mutation.score-metrics — floor and mutation-floor slice

Policy grade slice. This slice bounds score metrics to mutation.score-metrics. It uses `score-metrics-slice-floor` and checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8..

For score metrics, choose a repository example that satisfies killed_mutants at the floor and mutation-floor floor, plus a failure where killed mutants must meet the configured minimum of 8. is false. For score metrics, wire `floor and mutation-floor` to `rig-services/testing.mutation.score-metrics.json` and keep its verdict on killed_mutants; missing evidence is a named gap, with ceiling score metrics configuration validation only; declared policy does not prove running score metrics behavior. Choose a repository-owned check that observes score metrics from rig-services/testing.mutation.score-metrics.json..

Service-specific evidence cues:
Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.
minimal: killed mutants — 8.
mid: valid mutants — 10.
maximal: include invalid mutants in score — false.
