# development.architecture.tech-debt — mid

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Policy grade, mid: Name an accountable owner for the debt. Unowned debt is never scheduled, so assign a person or team to every listed item. Cumulative with minimal. Binding checks: tech-debt-source-code-boundary, tech-debt-architecture-context.

Acceptance target: policy:development.architecture.tech-debt:mid:tech-debt-source-code-boundary+tech-debt-architecture-context.
Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array); tech-debt-architecture-context: `owners` is nonempty (a string or array).
