# testing.maintenance.test-code-sync — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for test code sync. The evidence must preserve the changed_behaviors, updated_cases, tests_follow_output_blindly inputs that determined the result. Binding checks: test-code-sync-evidence-receipt.

Inspect a second run against unchanged test code sync inputs. Record the changed_behaviors, updated_cases, tests_follow_output_blindly inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this test code sync result is stale. The ceiling remains: test code sync configuration validation only; declared policy does not prove running test code sync behavior. Choose a repository-owned check that observes test code sync from rig-services/testing.maintenance.test-code-sync.json.

Acceptance target: fixture:testing.maintenance.test-code-sync:evidence-replay. Given the maintenance.test-code-sync binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Update tests from the intended contract when behavior changes. Copying new output into old assertions without a behavioral decision creates circular evidence.
minimal: changed behaviors — ["owner is required"].
mid: updated cases — ["reject missing owner"].
maximal: tests follow output blindly — false.
