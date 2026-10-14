# testing.strategy.risk-prioritization — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for risk prioritization. The evidence must preserve the high_risk_behaviors, impact_scores, prioritize_only_easy_cases inputs that determined the result. Binding checks: test-priority-ranking-evidence-receipt.

Inspect a second run against unchanged risk prioritization inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.risk-prioritization:evidence-replay. Given the strategy.risk-prioritization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`.

Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

minimal: high risk behaviors — ["payment duplication"].

mid: impact scores — [5].

maximal: prioritize only easy cases — false.
