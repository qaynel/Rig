# testing.integration.external-service — floor and mutation-floor slice

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Policy grade slice `external-service-slice-floor`: List the external contracts checked, with the provider and endpoint. Unnamed dependencies are unverified, so name each.
