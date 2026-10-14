# testing.strategy.coverage-gap — minimal

Minimal establishes a non-vacuous policy boundary for coverage gap. It checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract..

Start from a repository-owned command or existing native check that can observe strategy.coverage-gap; bind it to the input named in `rig-services/testing.strategy.coverage-gap.json` and preserve the check's failure status. For an existing repository, point the binding at its current command and record the path it reads. A missing binding, unreadable input, failed command, or claim outside strategy.coverage-gap is a failure.

Acceptance target: fixture:testing.strategy.coverage-gap:policy-boundary. Given source-code is present and strategy.coverage-gap is selected, pass only when the repository binding evaluates strategy.coverage-gap and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. A passing policy check does not establish runtime behavior.
