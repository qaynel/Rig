# testing.integration.external-service — identity

external service owns integration.external-service. Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Keep sibling services in integration under their own verdicts. Start from the configured input at `rig-services/testing.integration.external-service.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.
