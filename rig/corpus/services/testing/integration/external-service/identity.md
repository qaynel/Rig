# testing.integration.external-service — identity

Policy grade: external service owns integration.external-service. Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Keep sibling services in integration under their own verdicts. Start from the configured input at `rig-services/testing.integration.external-service.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern.

Service-specific evidence cues:
Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`.

Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

minimal: external contracts — ["payment authorization"].

mid: failure cases — ["timeout","malformed response"].

maximal: require production account — false.
