# testing.integration.external-service — mid

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: external-service-source-code-boundary, external-service-integration-context.

Inspect the existing repository's external service convention, then name the source path or command that establishes it. For external service, inspect the repository's actual spec, source, test, or configuration for failure_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the external service decision for integration.external-service.

Acceptance target: policy:testing.integration.external-service:mid:external-service-source-code-boundary+external-service-integration-context.

Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array); external-service-integration-context: `failure_cases` is nonempty (a string or array).
