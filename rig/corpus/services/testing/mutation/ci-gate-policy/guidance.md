# ci gate policy

Define the score threshold and inconclusive-result policy before the run. A timeout or unrun mutant cannot be silently counted as acceptable enforcement evidence.

Assurance remains Policy grade.

Set a mutation score threshold and decide how inconclusive runs affect CI. Timeouts and unrun mutants cannot silently count as acceptable evidence.

The policy input is `rig-services/testing.mutation.ci-gate-policy.json`. Keep its configuration visible to review: minimal supplies `minimum_score_percent` = `70`; mid adds `timeout_policy` = `"fail-inconclusive"`; maximal sets `allow_unrun_mutants` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
