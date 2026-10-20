# testing.mutation.score-metrics — floor slice

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Assurance remains Policy grade.

This Policy slice checks `killed_mutants` through `score-metrics-slice-floor`. The good fixture supplies `killed_mutants` = `8`; the bad fixture removes it.

Require the configured minimum number of killed mutants before publishing a sensitivity result. Keep the failure attached to `rig-services/testing.mutation.score-metrics.json`; do not infer that a mutation was generated or killed. score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.
