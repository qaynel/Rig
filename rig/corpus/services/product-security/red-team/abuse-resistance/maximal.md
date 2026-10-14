# product-security.red-team.abuse-resistance — maximal

Maximal adds a replayable evidence receipt for abuse resistance. The evidence must preserve the abuse_cases, rate_limit_policy, unbounded_public_requests inputs that determined the result.

Read a second run against unchanged abuse resistance inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: abuse resistance configuration validation only; declared policy does not prove running abuse resistance behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:product-security.red-team.abuse-resistance:evidence-replay. Given the red-team.abuse-resistance binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
