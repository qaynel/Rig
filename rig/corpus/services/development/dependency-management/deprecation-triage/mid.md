# development.dependency-management.deprecation-triage — mid

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Policy grade, mid: Name an owner for each replacement. Unowned migrations stall until removal breaks the build, so assign a person or team. Cumulative with minimal. Binding checks: deprecation-triage-source-code-boundary, deprecation-triage-dependency-management-context.

Acceptance target: policy:development.dependency-management.deprecation-triage:mid:deprecation-triage-source-code-boundary+deprecation-triage-dependency-management-context.
Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array); deprecation-triage-dependency-management-context: `replacement_owners` is nonempty (a string or array).
