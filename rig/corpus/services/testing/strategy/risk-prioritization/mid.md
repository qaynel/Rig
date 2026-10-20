# testing.strategy.risk-prioritization — mid

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: test-priority-ranking-source-code-boundary, test-priority-ranking-strategy-context.

Acceptance target: policy:testing.strategy.risk-prioritization:mid:test-priority-ranking-source-code-boundary+test-priority-ranking-strategy-context.

Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array); test-priority-ranking-strategy-context: `impact_scores` is nonempty (a string or array).
