# testing.strategy.risk-prioritization — minimal

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for risk prioritization. The minimal boundary for risk prioritization checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract. Binding checks: test-priority-ranking-source-code-boundary.

Acceptance target: policy:testing.strategy.risk-prioritization:minimal:test-priority-ranking-source-code-boundary.

Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array).
