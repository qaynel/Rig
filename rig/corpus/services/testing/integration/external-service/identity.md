# testing.integration.external-service — identity

Policy grade: external service owns integration.external-service. Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Keep neighboring integration services outside the external service decision for integration.external-service. Start from the configured input at `rig-services/testing.integration.external-service.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: external service configuration validation only; declared policy does not prove running external service behavior. Choose a repository-owned check that observes external service from rig-services/testing.integration.external-service.json.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.

Service-specific evidence cues:
Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.
minimal: external contracts — ["payment authorization"].
mid: failure cases — ["timeout","malformed response"].
maximal: require production account — false.
