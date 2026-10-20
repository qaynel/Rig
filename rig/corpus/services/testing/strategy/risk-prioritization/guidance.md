# risk-prioritization

Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`. Input: `rig-services/testing.strategy.risk-prioritization.json`.

Coverage ceiling: Configuration validation only, so it confirms high-risk behaviors, impact scores and the easy-cases-only flag are declared; it does not rank anything.

minimal: high risk behaviors — ["payment duplication"]. List the high-risk behaviors. Without them effort goes to the easy cases, so name the costly failures.

mid: impact scores — [5]. Give an impact score per behavior. Unscored risks cannot be ordered, so assign a value to each.

maximal: prioritize only easy cases — false. Set prioritizing only easy cases to false. Happy-path tests should not displace costly failure modes, so cover risk first.
