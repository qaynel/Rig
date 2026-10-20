# testing.mutation.ci-gate-policy — identity

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Policy grade. Set a mutation score threshold and decide how inconclusive runs affect CI. Timeouts and unrun mutants cannot silently count as acceptable evidence.

Applicable surface: source-code.

Owned scope: `mutation.ci-gate-policy`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. Configuration validation only, so it confirms a score threshold, a timeout policy and the unrun-mutant flag are declared; it does not run mutation testing.

Policy checks: minimal requires `minimum_score_percent` = `70`; mid adds `timeout_policy` = `"fail-inconclusive"`; maximal requires `allow_unrun_mutants` = `false`.
