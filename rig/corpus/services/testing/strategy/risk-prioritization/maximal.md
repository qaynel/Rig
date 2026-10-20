# testing.strategy.risk-prioritization — maximal

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Policy grade, maximal: Set prioritizing only easy cases to false. Happy-path tests should not displace costly failure modes, so cover risk first. Cumulative with minimal and mid. Binding checks: test-priority-ranking-source-code-boundary, test-priority-ranking-strategy-context, test-priority-ranking-evidence-receipt.

Acceptance target: policy:testing.strategy.risk-prioritization:maximal:test-priority-ranking-source-code-boundary+test-priority-ranking-strategy-context+test-priority-ranking-evidence-receipt.
Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array); test-priority-ranking-strategy-context: `impact_scores` is nonempty (a string or array); test-priority-ranking-evidence-receipt: `prioritize_only_easy_cases` equals false.
