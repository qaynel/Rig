# development.dependency-management.deprecation-triage — mid

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: deprecation-triage-source-code-boundary, deprecation-triage-dependency-management-context.

Trace the verdict to the existing repository's deprecation triage convention, then name the source path or command that establishes it. For deprecation triage, inspect the repository's actual spec, source, test, or configuration for replacement_owners; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring dependency-management services outside the deprecation triage decision for dependency-management.deprecation-triage.

Acceptance target: policy:development.dependency-management.deprecation-triage:mid:deprecation-triage-source-code-boundary+deprecation-triage-dependency-management-context.

Declared predicates: deprecation-triage-source-code-boundary: `deprecated_apis` is nonempty (a string or array); deprecation-triage-dependency-management-context: `replacement_owners` is nonempty (a string or array).
