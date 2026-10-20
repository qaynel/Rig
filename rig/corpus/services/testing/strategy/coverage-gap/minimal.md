# testing.strategy.coverage-gap — minimal

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for coverage gap. The minimal boundary for coverage gap checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract. Binding checks: coverage-gap-source-code-boundary.

Start from a repository-owned command or existing native check that can observe strategy.coverage-gap; bind it to the input named in `rig-services/testing.strategy.coverage-gap.json` and preserve the check's failure status. When adopting this in an existing repository, connect coverage gap to the command that inspects uncovered_behaviors and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside strategy.coverage-gap as a failure.

Acceptance target: policy:testing.strategy.coverage-gap:minimal:coverage-gap-source-code-boundary.

Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array).
