# score metrics

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.

