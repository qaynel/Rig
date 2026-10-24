# testing.mutation.equivalent-mutant-detector — floor slice

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Assurance remains Policy grade.

Evidence text must identify a reason to investigate equivalence, not merely repeat that tests passed. Configuration validation only, so it confirms equivalence evidence, review owners and the survival-only flag are declared; it does not analyze mutants.
