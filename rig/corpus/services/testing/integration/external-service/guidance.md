# external service

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`.

Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

minimal: external contracts — ["payment authorization"].

mid: failure cases — ["timeout","malformed response"].

maximal: require production account — false.

