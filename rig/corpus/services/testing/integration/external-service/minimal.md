# testing.integration.external-service — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for external service. The minimal boundary for external service checks external_contracts (nonempty): external contracts must name the concrete repository contract.. Binding checks: external-service-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe integration.external-service; bind it to the input named in `rig-services/testing.integration.external-service.json` and preserve the check's failure status. When adopting this in an existing repository, connect external service to the command that inspects external_contracts and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.external-service as a failure.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. The ceiling is external service configuration validation only; declared policy does not prove running external service behavior. Choose a repository-owned check that observes external service from rig-services/testing.integration.external-service.json..

Service-specific evidence cues:
Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.
minimal: external contracts — ["payment authorization"].
mid: failure cases — ["timeout","malformed response"].
maximal: require production account — false.
