# testing.strategy.risk-prioritization — maximal

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: test-priority-ranking-source-code-boundary, test-priority-ranking-strategy-context, test-priority-ranking-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:testing.strategy.risk-prioritization:maximal:test-priority-ranking-source-code-boundary+test-priority-ranking-strategy-context+test-priority-ranking-evidence-receipt.

Declared predicates: test-priority-ranking-source-code-boundary: `high_risk_behaviors` is nonempty (a string or array); test-priority-ranking-strategy-context: `impact_scores` is nonempty (a string or array); test-priority-ranking-evidence-receipt: `prioritize_only_easy_cases` equals false.
