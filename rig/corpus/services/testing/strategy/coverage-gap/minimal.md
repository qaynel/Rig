# testing.strategy.coverage-gap — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for coverage gap. The minimal boundary for coverage gap checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract.. Binding checks: coverage-gap-source-code-boundary.

Start from a repository-owned command or existing native check that can observe strategy.coverage-gap; bind it to the input named in `rig-services/testing.strategy.coverage-gap.json` and preserve the check's failure status. When adopting this in an existing repository, connect coverage gap to the command that inspects uncovered_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside strategy.coverage-gap as a failure.

Acceptance target: fixture:testing.strategy.coverage-gap:policy-boundary. Given source-code is present and strategy.coverage-gap is selected, pass only when the repository binding evaluates strategy.coverage-gap and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent strategy concern. The ceiling is coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Choose a repository-owned check that observes coverage gap from rig-services/testing.strategy.coverage-gap.json..

Service-specific evidence cues:
Offer: Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.
minimal: uncovered behaviors — ["expired token"].
mid: risk owners — ["auth team"].
maximal: claim complete from line coverage — false.
