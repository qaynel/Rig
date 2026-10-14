# testing.maintenance.readability-dry — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for readability dry. The evidence must preserve the scenario_names, shared_helpers, hide_assertions_in_helpers inputs that determined the result. Binding checks: readability-dry-evidence-receipt.

Inspect a second run against unchanged readability dry inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.readability-dry:evidence-replay. Given the maintenance.readability-dry binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Owned scope: `maintenance.readability-dry`.

Offer: Name scenarios by the behavior they establish and share setup only where it clarifies them. Hiding every assertion behind helpers makes failures harder to interpret.

Input: `rig-services/testing.maintenance.readability-dry.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

minimal: scenario names — ["expired token is rejected"].

mid: shared helpers — ["create valid account"].

maximal: hide assertions in helpers — false.
