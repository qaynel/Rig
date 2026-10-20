# score metrics

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Assurance remains Policy grade.

Compute sensitivity from valid mutants and make denominator exclusions explicit. Including invalid mutants can distort the score without measuring test sensitivity.

The policy input is `rig-services/testing.mutation.score-metrics.json`. Keep its configuration visible to review: minimal supplies `killed_mutants` = `8`; mid adds `valid_mutants` = `10`; maximal sets `include_invalid_mutants_in_score` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
