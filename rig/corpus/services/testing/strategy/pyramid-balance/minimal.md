# testing.strategy.pyramid-balance — minimal

Minimal establishes a non-vacuous policy boundary for pyramid balance. It checks unit_suites (nonempty): unit suites must name the concrete repository contract..

Tie acceptance to a repository-owned command or existing native check that can observe strategy.pyramid-balance; bind it to the input named in `rig-services/testing.strategy.pyramid-balance.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside strategy.pyramid-balance is a failure.

Acceptance target: fixture:testing.strategy.pyramid-balance:policy-boundary. Given source-code is present and strategy.pyramid-balance is selected, pass only when the repository binding evaluates strategy.pyramid-balance and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. A passing policy check does not establish runtime behavior.
