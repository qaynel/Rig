# development.architecture.tech-debt — maximal

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Policy grade, maximal: State the exit criteria that mark each item done. Without a completion condition a cleanup never ends, so write the observable check that closes it. Cumulative with minimal and mid. Binding checks: tech-debt-source-code-boundary, tech-debt-architecture-context, tech-debt-evidence-receipt.

Acceptance target: policy:development.architecture.tech-debt:maximal:tech-debt-source-code-boundary+tech-debt-architecture-context+tech-debt-evidence-receipt.
Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array); tech-debt-architecture-context: `owners` is nonempty (a string or array); tech-debt-evidence-receipt: `exit_criteria` is nonempty (a string or array).
