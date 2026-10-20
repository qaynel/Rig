# testing.mutation.score-metrics — mid

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Policy grade, mid: Declare valid mutants, at least 10. The denominator must exclude invalid mutants, so count only valid ones. Cumulative with minimal. Binding checks: score-metrics-source-code-boundary, score-metrics-mutation-context.
