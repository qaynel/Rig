# testing.mutation.score-metrics — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for score metrics. It checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8.. Binding checks: score-metrics-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe mutation.score-metrics; bind it to the input named in `rig-services/testing.mutation.score-metrics.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.score-metrics is a failure.

Acceptance target: fixture:testing.mutation.score-metrics:policy-boundary. Given source-code is present and mutation.score-metrics is selected, pass only when the repository binding evaluates mutation.score-metrics and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Owned scope: `mutation.score-metrics`.

Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Input: `rig-services/testing.mutation.score-metrics.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

minimal: killed mutants — 8.

mid: valid mutants — 10.

maximal: include invalid mutants in score — false.
