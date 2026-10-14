# testing.integration.external-service — behavior-oracle slice

Policy grade slice. This slice bounds external service to integration.external-service. It uses `external-service-slice-behavior-oracle` and checks external_contracts (nonempty): external contracts must name the concrete repository contract..

For external service, choose a repository example that satisfies external_contracts at the behavior-oracle floor, plus a failure where external contracts must name the concrete repository contract. is false. For external service, wire `behavior-oracle` to `rig-services/testing.integration.external-service.json` and keep its verdict on external_contracts; missing evidence is a named gap, with ceiling external service configuration validation only; declared policy does not prove running external service behavior. Choose a repository-owned check that observes external service from rig-services/testing.integration.external-service.json..

Service-specific evidence cues:
Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.
minimal: external contracts — ["payment authorization"].
mid: failure cases — ["timeout","malformed response"].
maximal: require production account — false.
