# survivor rca

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Assurance remains Policy grade.

Triage surviving mutants into missing assertions or justified equivalence questions. Treat a survivor as a signal for review, not automatically as a defect or as equivalent.

The policy input is `rig-services/testing.mutation.survivor-rca.json`. Keep its configuration visible to review: minimal supplies `surviving_mutants` = `["boundary comparison changed"]`; mid adds `missing_assertions` = `["exact limit rejected"]`; maximal sets `ignore_equivalence_question` = `false`.


The native check validates this service’s declared policy only; it does not run the service. For runtime assurance, run an approved repository-owned command and preserve its exit status.
