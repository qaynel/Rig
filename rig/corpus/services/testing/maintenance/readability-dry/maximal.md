# testing.maintenance.readability-dry — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for readability dry. The evidence must preserve the scenario_names, shared_helpers, hide_assertions_in_helpers inputs that determined the result. Binding checks: readability-dry-evidence-receipt.

Inspect a second run against unchanged readability dry inputs. Record the scenario_names, shared_helpers, hide_assertions_in_helpers inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this readability dry result is stale. The ceiling remains: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Choose a repository-owned check that observes readability dry from rig-services/testing.maintenance.readability-dry.json.

Acceptance target: fixture:testing.maintenance.readability-dry:evidence-replay. Given the maintenance.readability-dry binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.
minimal: scenario names — ["expired token is rejected"].
mid: shared helpers — ["create valid account"].
maximal: hide assertions in helpers — false.
