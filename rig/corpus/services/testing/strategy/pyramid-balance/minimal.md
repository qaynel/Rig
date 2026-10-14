# testing.strategy.pyramid-balance — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for pyramid balance. The minimal boundary for pyramid balance checks unit_suites (nonempty): unit suites must name the concrete repository contract.. Binding checks: pyramid-balance-source-code-boundary.

Tie acceptance to a repository-owned command or existing native check that can observe strategy.pyramid-balance; bind it to the input named in `rig-services/testing.strategy.pyramid-balance.json` and preserve the check's failure status. When adopting this in an existing repository, connect pyramid balance to the command that inspects unit_suites and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside strategy.pyramid-balance as a failure.

Acceptance target: fixture:testing.strategy.pyramid-balance:policy-boundary. Given source-code is present and strategy.pyramid-balance is selected, pass only when the repository binding evaluates strategy.pyramid-balance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. The ceiling is pyramid balance configuration validation only; declared policy does not prove running pyramid balance behavior. Choose a repository-owned check that observes pyramid balance from rig-services/testing.strategy.pyramid-balance.json..

Service-specific evidence cues:
Offer: Place fast local contract checks below focused integration and user-journey tests. An all-E2E strategy makes diagnosis slower and leaves many edge cases expensive to exercise.
minimal: unit suites — ["parser"].
mid: integration suites — ["api database"].
maximal: e2e only strategy — false.
