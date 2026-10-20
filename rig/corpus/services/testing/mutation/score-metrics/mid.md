# testing.mutation.score-metrics — mid

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: score-metrics-source-code-boundary, score-metrics-mutation-context.

Set `valid_mutants` to at least 10. Compare killed mutants with the valid-mutant denominator and separately account for invalid, timed-out, or unrun cases.

This remains configuration review. A value in `rig-services/testing.mutation.score-metrics.json` does not prove the command was run, that its output was correct, or that neighboring mutation stages were covered.

Repository-context target (not established by this policy check): policy:testing.mutation.score-metrics:mid:score-metrics-source-code-boundary+score-metrics-mutation-context.

Check: `score-metrics-mutation-context`.
