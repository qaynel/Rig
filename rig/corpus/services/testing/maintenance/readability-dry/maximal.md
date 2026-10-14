# testing.maintenance.readability-dry — maximal

Maximal adds a replayable evidence receipt for readability dry. The evidence must preserve the scenario_names, shared_helpers, hide_assertions_in_helpers inputs that determined the result.

Inspect a second run against unchanged readability dry inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: readability dry configuration validation only; declared policy does not prove running readability dry behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.readability-dry:evidence-replay. Given the maintenance.readability-dry binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
