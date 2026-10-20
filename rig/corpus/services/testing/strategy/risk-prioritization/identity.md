# testing.strategy.risk-prioritization — identity

Policy grade: risk prioritization owns strategy.risk-prioritization. Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Keep neighboring strategy services outside the risk prioritization decision for strategy.risk-prioritization. Use the configured input at `rig-services/testing.strategy.risk-prioritization.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Choose a repository-owned check that observes risk prioritization from rig-services/testing.strategy.risk-prioritization.json.

Acceptance target: policy:testing.strategy.risk-prioritization:minimal:test-priority-ranking-source-code-boundary.

Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array).
