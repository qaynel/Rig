# development.architecture.tech-debt — minimal

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Policy grade, minimal: List each debt item as an observable cost, not a cleanup label. An empty list gives maintenance work nothing to target, so name the concrete cost and where it lives. Binding checks: tech-debt-source-code-boundary.

Acceptance target: policy:development.architecture.tech-debt:minimal:tech-debt-source-code-boundary.
Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array).
