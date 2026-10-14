# testing.integration.external-service — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for external service; it does not widen ownership beyond integration.external-service. The context signals are failure_cases. Binding checks: external-service-integration-context.

Inspect the existing repository's external service convention, then name the source path or command that establishes it. In an adopted repository, use the current spec, source, test, or configuration file that actually governs this concern; if no inspectable source exists, report the gap instead of inferring a convention. Keep sibling services in integration under their own verdicts.

Acceptance target: fixture:testing.integration.external-service:repository-context. Given integration.external-service has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent integration concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Owned scope: `integration.external-service`.

Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.

Input: `rig-services/testing.integration.external-service.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: external service configuration validation only; declared policy does not prove running external service behavior. Select an approved repository-owned command to verify that behavior.

minimal: external contracts — ["payment authorization"].

mid: failure cases — ["timeout","malformed response"].

maximal: require production account — false.
