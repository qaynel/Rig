# development.code-creation.feature-implementation — mid

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Policy grade, mid: List the files or modules the change may touch. An empty scope lets edits spread unreviewed, so declare the agreed boundary. Cumulative with minimal. Binding checks: feature-implementation-source-code-boundary, feature-implementation-code-creation-context.

Acceptance target: policy:development.code-creation.feature-implementation:mid:feature-implementation-source-code-boundary+feature-implementation-code-creation-context.
Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array); feature-implementation-code-creation-context: `change_scope` is nonempty (a string or array).
