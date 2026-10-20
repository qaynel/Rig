# testing.mutation.score-metrics — identity

Calculate mutation sensitivity from valid mutants and identify excluded outcomes. Invalid mutations must not inflate or depress the score through an unexplained denominator.

Policy grade. Compute sensitivity from valid mutants and make denominator exclusions explicit. Including invalid mutants can distort the score without measuring test sensitivity.

Applicable surface: source-code.

Owned scope: `mutation.score-metrics`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.score-metrics.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `killed_mutants` = `8`; mid adds `valid_mutants` = `10`; maximal requires `include_invalid_mutants_in_score` = `false`.
