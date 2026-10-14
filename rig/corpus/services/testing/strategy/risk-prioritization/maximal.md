# testing.strategy.risk-prioritization — maximal

Maximal adds a replayable evidence receipt for risk prioritization. The evidence must preserve the high_risk_behaviors, impact_scores, prioritize_only_easy_cases inputs that determined the result.

Inspect a second run against unchanged risk prioritization inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.risk-prioritization:evidence-replay. Given the strategy.risk-prioritization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
