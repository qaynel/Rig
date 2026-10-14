# testing.mutation.score-metrics — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for score metrics. The minimal boundary for score metrics checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8.. Binding checks: score-metrics-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe mutation.score-metrics; bind it to the input named in `rig-services/testing.mutation.score-metrics.json` and preserve the check's failure status. When adopting this in an existing repository, connect score metrics to the command that inspects killed_mutants and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside mutation.score-metrics as a failure.

Acceptance target: fixture:testing.mutation.score-metrics:policy-boundary. Given source-code is present and mutation.score-metrics is selected, pass only when the repository binding evaluates mutation.score-metrics and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. The ceiling is score metrics configuration validation only; declared policy does not prove running score metrics behavior. Choose a repository-owned check that observes score metrics from rig-services/testing.mutation.score-metrics.json..

Service-specific evidence cues:
Offer: Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.
minimal: killed mutants — 8.
mid: valid mutants — 10.
maximal: include invalid mutants in score — false.
