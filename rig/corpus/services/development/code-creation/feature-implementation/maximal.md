# development.code-creation.feature-implementation — maximal

Maximal adds a replayable evidence receipt for feature implementation. The evidence must preserve the acceptance_cases, change_scope, compatibility inputs that determined the result.

Anchor the review on a second run against unchanged feature implementation inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: feature implementation configuration validation only; declared policy does not prove running feature implementation behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.feature-implementation:evidence-replay. Given the code-creation.feature-implementation binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
