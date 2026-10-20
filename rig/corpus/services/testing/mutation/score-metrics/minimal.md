# testing.mutation.score-metrics — minimal

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Grade: minimal. Assurance remains Policy grade.

Set `killed_mutants` to at least 8. Require the configured minimum number of killed mutants before publishing a sensitivity result.

Input: `rig-services/testing.mutation.score-metrics.json`. The selected binding must preserve a nonzero result when this field is missing or unreadable. The ceiling is: Configuration validation only, so it confirms killed and valid mutant counts and the invalid-in-score flag are declared; it does not compute a score.

Acceptance target: policy:testing.mutation.score-metrics:minimal:score-metrics-source-code-boundary.

Declared predicates: score-metrics-source-code-boundary: `killed_mutants` is numeric and at least 8.

Check: `score-metrics-source-code-boundary`.
