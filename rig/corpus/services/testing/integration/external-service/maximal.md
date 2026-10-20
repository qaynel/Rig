# testing.integration.external-service — maximal

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: external-service-source-code-boundary, external-service-integration-context, external-service-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:testing.integration.external-service:maximal:external-service-source-code-boundary+external-service-integration-context+external-service-evidence-receipt.

Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array); external-service-integration-context: `failure_cases` is nonempty (a string or array); external-service-evidence-receipt: `require_production_account` equals false.
