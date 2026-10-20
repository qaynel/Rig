# development.code-creation.feature-implementation — maximal

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: feature-implementation-source-code-boundary, feature-implementation-code-creation-context, feature-implementation-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.code-creation.feature-implementation:maximal:feature-implementation-source-code-boundary+feature-implementation-code-creation-context+feature-implementation-evidence-receipt.

Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array); feature-implementation-code-creation-context: `change_scope` is nonempty (a string or array); feature-implementation-evidence-receipt: `compatibility` is nonempty (a string or array).
