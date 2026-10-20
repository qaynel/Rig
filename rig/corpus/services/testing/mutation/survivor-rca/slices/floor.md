# testing.mutation.survivor-rca — floor slice

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Assurance remains Policy grade.

This Policy slice checks `surviving_mutants` through `survivor-rca-slice-floor`. The good fixture supplies `surviving_mutants` = `["boundary comparison changed"]`; the bad fixture removes it.

Name the surviving mutation so the investigation has a concrete starting point. Keep the failure attached to `rig-services/testing.mutation.survivor-rca.json`; do not infer that a mutation was generated or killed. survivor rca configuration validation only; declared policy does not prove running survivor rca behavior. Select an approved repository-owned command to verify that behavior.
