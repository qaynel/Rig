# testing.mutation.score-metrics — maximal

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Policy grade, maximal: Set including invalid mutants in the score to false. Invalid mutations distort the denominator, so exclude and report them. Cumulative with minimal and mid. Binding checks: score-metrics-source-code-boundary, score-metrics-mutation-context, score-metrics-evidence-receipt.
