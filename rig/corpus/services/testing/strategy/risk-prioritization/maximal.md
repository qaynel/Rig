# testing.strategy.risk-prioritization — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for risk prioritization. The evidence must preserve the high_risk_behaviors, impact_scores, prioritize_only_easy_cases inputs that determined the result. Binding checks: test-priority-ranking-evidence-receipt.

Inspect a second run against unchanged risk prioritization inputs. Record the high_risk_behaviors, impact_scores, prioritize_only_easy_cases inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this risk prioritization result is stale. The ceiling remains: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Choose a repository-owned check that observes risk prioritization from rig-services/testing.strategy.risk-prioritization.json.

Acceptance target: fixture:testing.strategy.risk-prioritization:evidence-replay. Given the strategy.risk-prioritization binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.
minimal: high risk behaviors — ["payment duplication"].
mid: impact scores — [5].
maximal: prioritize only easy cases — false.
