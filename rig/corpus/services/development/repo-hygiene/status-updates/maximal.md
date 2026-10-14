# development.repo-hygiene.status-updates — maximal

Maximal adds a replayable evidence receipt for status updates. The evidence must preserve the completed, in_flight, next_action inputs that determined the result.

Anchor the review on a second run against unchanged status updates inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: status updates configuration validation only; declared policy does not prove running status updates behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.repo-hygiene.status-updates:evidence-replay. Given the repo-hygiene.status-updates binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
