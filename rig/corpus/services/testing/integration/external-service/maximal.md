# testing.integration.external-service — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for external service. The evidence must preserve the external_contracts, failure_cases, require_production_account inputs that determined the result. Binding checks: external-service-evidence-receipt.

Tie acceptance to a second run against unchanged external service inputs. Record the external_contracts, failure_cases, require_production_account inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this external service result is stale. The ceiling remains: external service configuration validation only; declared policy does not prove running external service behavior. Choose a repository-owned check that observes external service from rig-services/testing.integration.external-service.json.

Acceptance target: fixture:testing.integration.external-service:evidence-replay. Given the integration.external-service binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Check the external contract with isolated test credentials and explicit failure cases. Integration validation must not require a production account or alter real customer data.
minimal: external contracts — ["payment authorization"].
mid: failure cases — ["timeout","malformed response"].
maximal: require production account — false.
