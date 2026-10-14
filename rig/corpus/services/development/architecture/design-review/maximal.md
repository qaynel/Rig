# development.architecture.design-review — maximal

Maximal adds a replayable evidence receipt for design review. The evidence must preserve the reviewed_interfaces, tradeoffs, unresolved_tradeoffs inputs that determined the result.

Inspect a second run against unchanged design review inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: design review configuration validation only; declared policy does not prove running design review behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.design-review:evidence-replay. Given the architecture.design-review binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
