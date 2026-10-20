# testing.integration.cross-module — mid

Exercise interactions between real modules and assert their shared observable result. Stubbing the internal boundary defeats the purpose of the integration check.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: cross-module-source-code-boundary, cross-module-integration-context.

Ground the decision in the existing repository's cross module convention, then name the source path or command that establishes it. For cross module, inspect the repository's actual spec, source, test, or configuration for interaction_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the cross module decision for integration.cross-module.

Acceptance target: policy:testing.integration.cross-module:mid:cross-module-source-code-boundary+cross-module-integration-context.

Declared predicates: cross-module-source-code-boundary: `participating_modules` is nonempty (a string or array); cross-module-integration-context: `interaction_cases` is nonempty (a string or array).
