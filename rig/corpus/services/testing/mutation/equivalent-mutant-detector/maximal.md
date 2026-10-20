# testing.mutation.equivalent-mutant-detector — maximal

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Policy grade, maximal: Set classifying by survival only to false. Treating every survivor as equivalent hides real unasserted behavior, so require evidence. Cumulative with minimal and mid. Binding checks: equivalent-mutant-detector-source-code-boundary, equivalent-mutant-detector-mutation-context, equivalent-mutant-detector-evidence-receipt.
