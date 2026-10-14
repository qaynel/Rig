# testing.mutation.score-metrics — minimal

Minimal establishes a non-vacuous policy boundary for score metrics. It checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8..

Tie acceptance to a repository-owned command or existing native check that can observe mutation.score-metrics; bind it to the input named in `rig-services/testing.mutation.score-metrics.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside mutation.score-metrics is a failure.

Acceptance target: fixture:testing.mutation.score-metrics:policy-boundary. Given source-code is present and mutation.score-metrics is selected, pass only when the repository binding evaluates mutation.score-metrics and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent mutation concern. A passing policy check does not establish runtime behavior.
