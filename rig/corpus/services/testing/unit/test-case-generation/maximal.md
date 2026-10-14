# testing.unit.test-case-generation — maximal

Maximal adds a replayable evidence receipt for test case generation. The evidence must preserve the behavior_cases, asserted_outcomes, assert_implementation_details inputs that determined the result.

Read a second run against unchanged test case generation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: test case generation configuration validation only; declared policy does not prove running test case generation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.unit.test-case-generation:evidence-replay. Given the unit.test-case-generation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
