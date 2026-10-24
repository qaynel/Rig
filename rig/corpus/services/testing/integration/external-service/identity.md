# testing.integration.external-service — identity

Policy grade: external-service owns integration.external-service. Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Configuration validation only, so it confirms external contracts, failure cases and the production-account flag are declared; it does not call the service.

Disposition: executable.
Acceptance target: policy:testing.integration.external-service:minimal:external-service-source-code-boundary.
Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array).
