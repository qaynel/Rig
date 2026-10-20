# testing.mutation.survivor-rca — identity

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Policy grade. Triage surviving mutants into missing assertions or justified equivalence questions. Treat a survivor as a signal for review, not automatically as a defect or as equivalent.

Applicable surface: source-code.

Owned scope: `mutation.survivor-rca`. Keep adjacent mutation concerns separate; this service covers the declared mutation policy only.

Read `rig-services/testing.mutation.survivor-rca.json`; malformed input remains attributable to that path. The good and bad fixtures show the configuration boundary, not a mutation run.

Disposition: executable. The installed native checks evaluate the declared fields; they do not demonstrate tool behavior. survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.

Policy checks: minimal requires `surviving_mutants` = `["boundary comparison changed"]`; mid adds `missing_assertions` = `["exact limit rejected"]`; maximal requires `ignore_equivalence_question` = `false`.
