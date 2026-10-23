# testing.integration.external-service — behavior-oracle slice

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade slice `external-service-slice-behavior-oracle`: List the external contracts checked, with the provider and endpoint. Unnamed dependencies are unverified, so name each. Despite its name this slice is not a behavior oracle: it confirms external contracts, failure cases and the production-account flag are declared; it does not call the service.
