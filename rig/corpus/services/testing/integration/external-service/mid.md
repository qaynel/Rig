# testing.integration.external-service — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for external service; it does not widen ownership beyond integration.external-service. For external service, inspect these context signals: failure_cases. Binding checks: external-service-integration-context.

Inspect the existing repository's external service convention, then name the source path or command that establishes it. For external service, inspect the repository's actual spec, source, test, or configuration for failure_cases; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring integration services outside the external service decision for integration.external-service.

Acceptance target: fixture:testing.integration.external-service:repository-context. Given integration.external-service has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.
minimal: external contracts — ["payment authorization"].
mid: failure cases — ["timeout","malformed response"].
maximal: require production account — false.
