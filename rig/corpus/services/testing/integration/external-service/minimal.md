# testing.integration.external-service — minimal

Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for external service. The minimal boundary for external service checks external_contracts (nonempty): external contracts must name the concrete repository contract. Binding checks: external-service-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe integration.external-service; bind it to the input named in `rig-services/testing.integration.external-service.json` and preserve the check's failure status. When adopting this in an existing repository, connect external service to the command that inspects external_contracts and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside integration.external-service as a failure.

Acceptance target: policy:testing.integration.external-service:minimal:external-service-source-code-boundary.

Declared predicates: external-service-source-code-boundary: `external_contracts` is nonempty (a string or array).
