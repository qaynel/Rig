# testing.strategy.risk-prioritization — behavior-oracle slice

Policy grade slice. This slice bounds risk prioritization to strategy.risk-prioritization. It uses `risk-prioritization-slice-behavior-oracle` and checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.strategy.risk-prioritization.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`.

Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

minimal: high risk behaviors — ["payment duplication"].

mid: impact scores — [5].

maximal: prioritize only easy cases — false.
