# testing.mutation.score-metrics — identity

Policy grade: score metrics owns mutation.score-metrics. Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Keep neighboring mutation services outside the score metrics decision for mutation.score-metrics. Anchor the review on the configured input at `rig-services/testing.mutation.score-metrics.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Choose a repository-owned check that observes score metrics from rig-services/testing.mutation.score-metrics.json.

Acceptance target: fixture:testing.mutation.score-metrics:policy-boundary. Given source-code is present and mutation.score-metrics is selected, pass only when the repository binding evaluates mutation.score-metrics and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.
minimal: killed mutants — 8.
mid: valid mutants — 10.
maximal: include invalid mutants in score — false.
