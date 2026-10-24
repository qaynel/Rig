# development.code-creation.feature-implementation — minimal

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Policy grade, minimal: Write the observable acceptance cases before touching source. An empty list means no outcome defines done, so name what a user or caller will see. Binding checks: feature-implementation-source-code-boundary.

Acceptance target: policy:development.code-creation.feature-implementation:minimal:feature-implementation-source-code-boundary.
Declared predicates: feature-implementation-source-code-boundary: `acceptance_cases` is nonempty (a string or array).
