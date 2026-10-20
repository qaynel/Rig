# testing.integration.external-service — mid

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade, mid: List the failure cases exercised, such as timeout and error responses. A happy-path-only check misses outages, so add them. Cumulative with minimal. Binding checks: external-service-source-code-boundary, external-service-integration-context.

Acceptance target: policy:testing.integration.external-service:mid:external-service-source-code-boundary+external-service-integration-context.
Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array); external-service-integration-context: `failure_cases` is nonempty (a string or array).
