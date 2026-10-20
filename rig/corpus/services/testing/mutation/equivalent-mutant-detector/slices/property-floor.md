# testing.mutation.equivalent-mutant-detector — property-floor slice

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Assurance remains Policy grade.

This slice verifies the configured `equivalence_evidence` rule using `equivalent-mutant-detector-slice-property-floor`. Record evidence and human ownership before classifying a mutant as behaviorally equivalent.

The accepted fixture contains `equivalence_evidence` = `["unreachable branch by domain proof"]`; the invalid fixture demonstrates the missing-field case. This checks policy shape only, not a property of generated mutants.
