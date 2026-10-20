# testing.integration.external-service — property-floor slice

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade slice. This slice bounds external service to integration.external-service. It uses `external-service-slice-property-floor` and checks external_contracts (nonempty): external contracts must name the concrete repository contract.