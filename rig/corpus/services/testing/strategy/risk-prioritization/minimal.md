# testing.strategy.risk-prioritization — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for risk prioritization. The minimal boundary for risk prioritization checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract.. Binding checks: test-priority-ranking-source-code-boundary.

Trace the verdict to a repository-owned command or existing native check that can observe strategy.risk-prioritization; bind it to the input named in `rig-services/testing.strategy.risk-prioritization.json` and preserve the check's failure status. When adopting this in an existing repository, connect risk prioritization to the command that inspects high_risk_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside strategy.risk-prioritization as a failure.

Acceptance target: fixture:testing.strategy.risk-prioritization:policy-boundary. Given source-code is present and strategy.risk-prioritization is selected, pass only when the repository binding evaluates strategy.risk-prioritization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. The ceiling is risk prioritization configuration validation only; declared policy does not prove running risk prioritization behavior. Choose a repository-owned check that observes risk prioritization from rig-services/testing.strategy.risk-prioritization.json..

Service-specific evidence cues:
Offer: Choose checks by failure impact and likelihood. Easy happy-path cases should not displace financially or operationally costly failure modes.
minimal: high risk behaviors — ["payment duplication"].
mid: impact scores — [5].
maximal: prioritize only easy cases — false.
