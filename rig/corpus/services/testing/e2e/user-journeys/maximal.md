# testing.e2e.user-journeys — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for user journeys. The evidence must preserve the journeys, observable_outcomes, assert_only_page_loaded inputs that determined the result. Binding checks: user-journeys-evidence-receipt.

Inspect a second run against unchanged user journeys inputs. Record the journeys, observable_outcomes, assert_only_page_loaded inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this user journeys result is stale. The ceiling remains: user journeys configuration validation only; declared policy does not prove running user journeys behavior. Choose a repository-owned check that observes user journeys from rig-services/testing.e2e.user-journeys.json.

Acceptance target: fixture:testing.e2e.user-journeys:evidence-replay. Given the e2e.user-journeys binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Follow the user through the complete outcome, including persistence or resulting state. A page-loading check cannot prove that the requested journey succeeded.
minimal: journeys — ["create and retrieve item"].
mid: observable outcomes — ["item appears after refresh"].
maximal: assert only page loaded — false.
