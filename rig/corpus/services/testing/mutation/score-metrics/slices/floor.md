# testing.mutation.score-metrics — floor and mutation-floor slice

Policy grade slice. This slice bounds score metrics to mutation.score-metrics. It uses `score-metrics-slice-floor` and checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8..

Trace the verdict to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.score-metrics.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.
