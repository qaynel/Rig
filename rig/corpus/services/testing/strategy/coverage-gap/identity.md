# testing.strategy.coverage-gap — identity

Policy grade: coverage gap owns strategy.coverage-gap. Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Keep neighboring strategy services outside the coverage gap decision for strategy.coverage-gap. Ground the decision in the configured input at `rig-services/testing.strategy.coverage-gap.json`; malformed input is still attributed to that path.

Disposition: executable. Use the limit: coverage gap configuration validation only; declared policy does not prove running coverage gap behavior. Choose a repository-owned check that observes coverage gap from rig-services/testing.strategy.coverage-gap.json.

Acceptance target: policy:testing.strategy.coverage-gap:minimal:coverage-gap-source-code-boundary.

Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array).
