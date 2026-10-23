# testing.strategy.risk-prioritization — identity

Policy grade: risk-prioritization owns strategy.risk-prioritization. Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Configuration validation only, so it confirms high-risk behaviors, impact scores and the easy-cases-only flag are declared; it does not rank anything.

Disposition: executable.
Acceptance target: policy:testing.strategy.risk-prioritization:minimal:test-priority-ranking-source-code-boundary.
Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array).
