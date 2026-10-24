# external-service

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`. Input: `rig-services/testing.integration.external-service.json`.

Coverage ceiling: Configuration validation only, so it confirms external contracts, failure cases and the production-account flag are declared; it does not call the service.

minimal: external contracts — ["payment authorization"]. List the external contracts checked, with the provider and endpoint. Unnamed dependencies are unverified, so name each.

mid: failure cases — ["timeout","malformed response"]. List the failure cases exercised, such as timeout and error responses. A happy-path-only check misses outages, so add them.

maximal: require production account — false. Set requiring a production account to false. Tests must not touch real customer data, so use isolated test credentials.
