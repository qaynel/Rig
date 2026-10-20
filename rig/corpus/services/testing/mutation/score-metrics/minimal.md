# testing.mutation.score-metrics — minimal

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Grade: minimal. Assurance remains Policy grade. This check rejects a policy with no killed_mutants: the bad fixture has `killed_mutants` = `-1`, while the accepted fixture has `killed_mutants` = `8`.

Set `killed_mutants` to at least 8. The result says only that the configured operator or input is present. Require the configured minimum number of killed mutants before publishing a sensitivity result.

Input: `rig-services/testing.mutation.score-metrics.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: policy:testing.mutation.score-metrics:minimal:score-metrics-source-code-boundary.

Declared predicates: score-metrics-source-code-boundary: `killed_mutants` is numeric and at least 8.

Check: `score-metrics-source-code-boundary`.
