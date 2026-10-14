# testing.mutation.score-metrics — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for score metrics; it does not widen ownership beyond mutation.score-metrics. For score metrics, inspect these context signals: valid_mutants. Binding checks: score-metrics-mutation-context.

Read the existing repository's score metrics convention, then name the source path or command that establishes it. For score metrics, inspect the repository's actual spec, source, test, or configuration for valid_mutants; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring mutation services outside the score metrics decision for mutation.score-metrics.

Acceptance target: fixture:testing.mutation.score-metrics:repository-context. Given mutation.score-metrics has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent mutation concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.
minimal: killed mutants — 8.
mid: valid mutants — 10.
maximal: include invalid mutants in score — false.
