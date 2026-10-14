# testing.integration.external-service — floor and mutation-floor slice

Policy grade slice. This slice bounds external service to integration.external-service. It uses `external-service-slice-floor` and checks external_contracts (nonempty): external contracts must name the concrete repository contract..

Use a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.integration.external-service.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`.

Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

minimal: external contracts — ["payment authorization"].

mid: failure cases — ["timeout","malformed response"].

maximal: require production account — false.
