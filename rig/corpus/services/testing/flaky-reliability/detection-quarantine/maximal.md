# testing.flaky-reliability.detection-quarantine — maximal

Maximal adds a replayable evidence receipt for detection quarantine. The evidence must preserve the flaky_cases, quarantine_owners, silent_quarantine inputs that determined the result.

Use a second run against unchanged detection quarantine inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.flaky-reliability.detection-quarantine:evidence-replay. Given the flaky-reliability.detection-quarantine binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
