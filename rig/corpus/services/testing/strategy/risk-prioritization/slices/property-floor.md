# testing.strategy.risk-prioritization — property-floor slice

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Policy grade slice. This slice bounds risk prioritization to strategy.risk-prioritization. It uses `risk-prioritization-slice-property-floor` and checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract.