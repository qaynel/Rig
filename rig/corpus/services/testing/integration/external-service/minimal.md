# testing.integration.external-service — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for external service. It checks external_contracts (nonempty): external contracts must name the concrete repository contract.. Binding checks: external-service-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe integration.external-service; bind it to the input named in `rig-services/testing.integration.external-service.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside integration.external-service is a failure.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`.

Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

minimal: external contracts — ["payment authorization"].

mid: failure cases — ["timeout","malformed response"].

maximal: require production account — false.
