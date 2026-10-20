# testing.integration.external-service — maximal

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade, maximal: Set requiring a production account to false. Tests must not touch real customer data, so use isolated test credentials. Cumulative with minimal and mid. Binding checks: external-service-source-code-boundary, external-service-integration-context, external-service-evidence-receipt.

Acceptance target: policy:testing.integration.external-service:maximal:external-service-source-code-boundary+external-service-integration-context+external-service-evidence-receipt.
Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array); external-service-integration-context: `failure_cases` is nonempty (a string or array); external-service-evidence-receipt: `require_production_account` equals false.
