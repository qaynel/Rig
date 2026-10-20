# risk prioritization

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`.

Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

minimal: high risk behaviors — ["payment duplication"].

mid: impact scores — [5].

maximal: prioritize only easy cases — false.
