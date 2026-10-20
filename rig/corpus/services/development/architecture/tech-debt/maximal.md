# development.architecture.tech-debt — maximal

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: tech-debt-source-code-boundary, tech-debt-architecture-context, tech-debt-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.architecture.tech-debt:maximal:tech-debt-source-code-boundary+tech-debt-architecture-context+tech-debt-evidence-receipt.

Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array); tech-debt-architecture-context: `owners` is nonempty (a string or array); tech-debt-evidence-receipt: `exit_criteria` is nonempty (a string or array).
