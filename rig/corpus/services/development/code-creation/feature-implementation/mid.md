# development.code-creation.feature-implementation — mid

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: feature-implementation-source-code-boundary, feature-implementation-code-creation-context.

Trace the verdict to the existing repository's feature implementation convention, then name the source path or command that establishes it. For feature implementation, inspect the repository's actual spec, source, test, or configuration for change_scope; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring code-creation services outside the feature implementation decision for code-creation.feature-implementation.

Acceptance target: policy:development.code-creation.feature-implementation:mid:feature-implementation-source-code-boundary+feature-implementation-code-creation-context.

Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array); feature-implementation-code-creation-context: `change_scope` is nonempty (a string or array).
