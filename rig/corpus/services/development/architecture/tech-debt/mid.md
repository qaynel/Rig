# development.architecture.tech-debt — mid

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: tech-debt-source-code-boundary, tech-debt-architecture-context.

Read the existing repository's tech debt convention, then name the source path or command that establishes it. For tech debt, inspect the repository's actual spec, source, test, or configuration for owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring architecture services outside the tech debt decision for architecture.tech-debt.

Acceptance target: policy:development.architecture.tech-debt:mid:tech-debt-source-code-boundary+tech-debt-architecture-context.

Declared predicates: tech-debt-source-code-boundary: `debt_items` is nonempty (a string or array); tech-debt-architecture-context: `owners` is nonempty (a string or array).
