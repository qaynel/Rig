# testing.mutation.score-metrics — maximal

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: score-metrics-source-code-boundary, score-metrics-mutation-context, score-metrics-evidence-receipt.

Keep `include_invalid_mutants_in_score` equal to false. Keep invalid mutants excluded; the numeric policy does not prove that result classification or arithmetic is correct.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.score-metrics:maximal:score-metrics-source-code-boundary+score-metrics-mutation-context+score-metrics-evidence-receipt.

Check: `score-metrics-evidence-receipt`.
