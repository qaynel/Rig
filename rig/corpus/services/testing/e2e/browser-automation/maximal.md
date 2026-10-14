# testing.e2e.browser-automation — maximal

Maximal adds a replayable evidence receipt for browser automation. The evidence must preserve the browser_targets, interaction_steps, fixed_sleeps inputs that determined the result.

Trace the verdict to a second run against unchanged browser automation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.e2e.browser-automation:evidence-replay. Given the e2e.browser-automation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
