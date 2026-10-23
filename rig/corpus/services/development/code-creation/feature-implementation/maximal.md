# development.code-creation.feature-implementation — maximal

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Policy grade, maximal: State the compatibility expectations for existing callers or data. Leaving them implicit hides breaking changes, so record what must keep working. Cumulative with minimal and mid. Binding checks: feature-implementation-source-code-boundary, feature-implementation-code-creation-context, feature-implementation-evidence-receipt.

Acceptance target: policy:development.code-creation.feature-implementation:maximal:feature-implementation-source-code-boundary+feature-implementation-code-creation-context+feature-implementation-evidence-receipt.
Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array); feature-implementation-code-creation-context: `change_scope` is nonempty (a string or array); feature-implementation-evidence-receipt: `compatibility` is nonempty (a string or array).
