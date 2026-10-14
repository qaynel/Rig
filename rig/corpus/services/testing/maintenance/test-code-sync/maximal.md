# testing.maintenance.test-code-sync — maximal

Maximal adds a replayable evidence receipt for test code sync. The evidence must preserve the changed_behaviors, updated_cases, tests_follow_output_blindly inputs that determined the result.

Inspect a second run against unchanged test code sync inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.test-code-sync:evidence-replay. Given the maintenance.test-code-sync binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
