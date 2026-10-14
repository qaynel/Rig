# testing.mutation.score-metrics — identity

Policy grade: score metrics owns mutation.score-metrics. Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Keep sibling services in mutation under their own verdicts. Anchor the review on the configured input at `rig-services/testing.mutation.score-metrics.json`; malformed input is still attributed to that path.

Disposition: convention. Inspect the limit: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.mutation.score-metrics:policy-boundary. Given source-code is present and mutation.score-metrics is selected, pass only when the repository binding evaluates mutation.score-metrics and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern.

Service-specific evidence cues:
Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.
