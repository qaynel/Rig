# testing.mutation.equivalent-mutant-detector — maximal

Require behavioral reasoning before marking a mutant equivalent. Survival can mean missing tests, so it cannot itself prove that a mutation changes no behavior.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: equivalent-mutant-detector-source-code-boundary, equivalent-mutant-detector-mutation-context, equivalent-mutant-detector-evidence-receipt.

Keep `classify_by_survival_only` equal to false. The policy forbids survival-only classification; an actual equivalence decision still needs reviewed evidence.

Maximal here adds a configuration guard, not an evidence receipt or a demonstrated mutation outcome. equivalent mutant detector configuration validation only; declared policy does not prove running equivalent mutant detector behavior. Select an approved repository-owned command to verify that behavior.

Evidence-replay target (not established by this policy check): policy:testing.mutation.equivalent-mutant-detector:maximal:equivalent-mutant-detector-source-code-boundary+equivalent-mutant-detector-mutation-context+equivalent-mutant-detector-evidence-receipt.

Check: `equivalent-mutant-detector-evidence-receipt`.
