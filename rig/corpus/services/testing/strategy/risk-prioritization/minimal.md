# testing.strategy.risk-prioritization — minimal

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Policy grade, minimal: List the high-risk behaviors. Without them effort goes to the easy cases, so name the costly failures. Binding checks: test-priority-ranking-source-code-boundary.

Acceptance target: policy:testing.strategy.risk-prioritization:minimal:test-priority-ranking-source-code-boundary.
Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array).
