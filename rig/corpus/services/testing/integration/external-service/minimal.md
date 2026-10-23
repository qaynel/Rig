# testing.integration.external-service — minimal

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade, minimal: List the external contracts checked, with the provider and endpoint. Unnamed dependencies are unverified, so name each. Binding checks: external-service-source-code-boundary.

Acceptance target: policy:testing.integration.external-service:minimal:external-service-source-code-boundary.
Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array).
