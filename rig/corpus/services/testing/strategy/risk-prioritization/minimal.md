# testing.strategy.risk-prioritization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for risk prioritization. It checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract.. Binding checks: test-priority-ranking-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe strategy.risk-prioritization; bind it to the input named in `rig-services/testing.strategy.risk-prioritization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside strategy.risk-prioritization is a failure.

Acceptance target: fixture:testing.strategy.risk-prioritization:policy-boundary. Given source-code is present and strategy.risk-prioritization is selected, pass only when the repository binding evaluates strategy.risk-prioritization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. A passing policy check does not establish runtime behavior.

Service-specific evidence cues:
Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Owned scope: `strategy.risk-prioritization`.

Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.

Input: `rig-services/testing.strategy.risk-prioritization.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Select an approved repository-owned command to verify that behavior.

minimal: high risk behaviors — ["payment duplication"].

mid: impact scores — [5].

maximal: prioritize only easy cases — false.
