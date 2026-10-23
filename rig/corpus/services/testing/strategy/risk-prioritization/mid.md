# testing.strategy.risk-prioritization — mid

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Policy grade, mid: Give an impact score per behavior. Unscored risks cannot be ordered, so assign a value to each. Cumulative with minimal. Binding checks: test-priority-ranking-source-code-boundary, test-priority-ranking-strategy-context.

Acceptance target: policy:testing.strategy.risk-prioritization:mid:test-priority-ranking-source-code-boundary+test-priority-ranking-strategy-context.
Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array); test-priority-ranking-strategy-context: `impact_scores` is nonempty (a string or array).
