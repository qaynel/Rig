# testing.mutation.equivalent-mutant-detector — mid

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Policy grade, mid: Name who reviews equivalence claims. An unreviewed claim hides test gaps, so assign reviewers. Cumulative with minimal. Binding checks: equivalent-mutant-detector-source-code-boundary, equivalent-mutant-detector-mutation-context.
