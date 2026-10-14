# development.code-creation.refactoring — maximal

Maximal adds a replayable evidence receipt for refactoring. The evidence must preserve the preserved_behaviors, public_api_changes, rollback_strategy inputs that determined the result.

Start from a second run against unchanged refactoring inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.refactoring:evidence-replay. Given the code-creation.refactoring binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
