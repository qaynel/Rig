# testing.strategy.risk-prioritization — identity

risk prioritization owns strategy.risk-prioritization. Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Keep sibling services in strategy under their own verdicts. Use the configured input at `rig-services/testing.strategy.risk-prioritization.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:testing.strategy.risk-prioritization:policy-boundary. Given source-code is present and strategy.risk-prioritization is selected, pass only when the repository binding evaluates strategy.risk-prioritization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern.
