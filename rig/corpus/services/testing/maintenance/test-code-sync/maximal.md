# testing.maintenance.test-code-sync — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for test code sync. The evidence must preserve the changed_behaviors, updated_cases, tests_follow_output_blindly inputs that determined the result. Binding checks: test-code-sync-evidence-receipt.

Inspect a second run against unchanged test code sync inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.maintenance.test-code-sync:evidence-replay. Given the maintenance.test-code-sync binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Owned scope: `maintenance.test-code-sync`.

Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.

Input: `rig-services/testing.maintenance.test-code-sync.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Select an approved repository-owned command to verify that behavior.

minimal: changed behaviors — ["owner is required"].

mid: updated cases — ["reject missing owner"].

maximal: tests follow output blindly — false.
