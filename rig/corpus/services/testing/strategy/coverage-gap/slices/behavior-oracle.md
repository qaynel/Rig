# testing.strategy.coverage-gap — behavior-oracle slice

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Policy grade slice `coverage-gap-slice-behavior-oracle`: List the behaviors that lack tests. Line coverage locates unused code, not unasserted outcomes, so name the behaviors. Despite its name this slice is not a behavior oracle: it confirms uncovered behaviors, risk owners and the line-coverage-complete flag are declared; it does not measure coverage.
