# testing.mutation.survivor-rca — property-floor slice

Explain each surviving mutation as a test gap or an independently justified equivalence. Treating every survivor alike misses both false positives and real unasserted outcomes.

Assurance remains Policy grade.

This slice verifies the configured `surviving_mutants` rule using `survivor-rca-slice-property-floor`. Triage surviving mutants into missing assertions or justified equivalence questions.

The accepted fixture contains `surviving_mutants` = `["boundary comparison changed"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
