# testing.strategy.risk-prioritization — minimal

Minimal establishes a non-vacuous policy boundary for risk prioritization. It checks high_risk_behaviors (nonempty): high risk behaviors must name the concrete repository contract..

Trace the verdict to a repository-owned command or existing native check that can observe strategy.risk-prioritization; bind it to the input named in `rig-services/testing.strategy.risk-prioritization.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside strategy.risk-prioritization is a failure.

Acceptance target: fixture:testing.strategy.risk-prioritization:policy-boundary. Given source-code is present and strategy.risk-prioritization is selected, pass only when the repository binding evaluates strategy.risk-prioritization and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. A passing policy check does not establish runtime behavior.
