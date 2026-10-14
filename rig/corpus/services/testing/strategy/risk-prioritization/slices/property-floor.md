# testing.strategy.risk-prioritization — property-floor slice

Policy grade slice. This slice bounds risk prioritization to strategy.risk-prioritization. It uses `risk-prioritization-slice-property-floor` and checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract..

For risk prioritization, choose a repository example that satisfies high_risk_behaviors at the property-floor floor, plus a failure where high risk behaviors must name the concrete repository contract. is false. For risk prioritization, wire `property-floor` to `rig-services/testing.strategy.risk-prioritization.json` and keep its verdict on high_risk_behaviors; missing evidence is a named gap, with ceiling risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Choose a repository-owned check that observes risk prioritization from rig-services/testing.strategy.risk-prioritization.json..

Service-specific evidence cues:
Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.
minimal: high risk behaviors — ["payment duplication"].
mid: impact scores — [5].
maximal: prioritize only easy cases — false.
