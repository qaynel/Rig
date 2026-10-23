# testing.strategy.coverage-gap — identity

Policy grade: coverage-gap owns strategy.coverage-gap. Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Input: `rig-services/testing.strategy.coverage-gap.json`. Configuration validation only, so it confirms uncovered behaviors, risk owners and the line-coverage-complete flag are declared; it does not measure coverage.

Disposition: executable.
Acceptance target: policy:testing.strategy.coverage-gap:minimal:coverage-gap-source-code-boundary.
Declared predicates: coverage-gap-source-code-boundary: `uncovered_behaviors` is nonempty (a string or array).
