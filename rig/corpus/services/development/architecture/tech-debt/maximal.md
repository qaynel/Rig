# development.architecture.tech-debt — maximal

Maximal adds a replayable evidence receipt for tech debt. The evidence must preserve the debt_items, owners, exit_criteria inputs that determined the result.

Ground the decision in a second run against unchanged tech debt inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: tech debt configuration validation only; declared policy does not prove running tech debt behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.architecture.tech-debt:evidence-replay. Given the architecture.tech-debt binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
