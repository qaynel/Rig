# development.dependency-management.deprecation-triage — maximal

Maximal adds a replayable evidence receipt for deprecation triage. The evidence must preserve the deprecated_apis, replacement_owners, ignore_removal_deadline inputs that determined the result.

Anchor the review on a second run against unchanged deprecation triage inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: deprecation triage configuration validation only; declared policy does not prove running deprecation triage behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.dependency-management.deprecation-triage:evidence-replay. Given the dependency-management.deprecation-triage binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
