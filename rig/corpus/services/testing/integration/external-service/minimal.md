# testing.integration.external-service — minimal

Minimal establishes a non-vacuous policy boundary for external service. It checks external_contracts (nonempty): external contracts must name the concrete repository contract..

Anchor the review on a repository-owned command or existing native check that can observe integration.external-service; bind it to the input named in `rig-services/testing.integration.external-service.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside integration.external-service is a failure.

Acceptance target: fixture:testing.integration.external-service:policy-boundary. Given source-code is present and integration.external-service is selected, pass only when the repository binding evaluates integration.external-service and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent integration concern. A passing policy check does not establish runtime behavior.
