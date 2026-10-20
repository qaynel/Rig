# testing.strategy.coverage-gap — behavior-oracle slice

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Policy grade slice. This slice bounds coverage gap to strategy.coverage-gap. It uses `coverage-gap-slice-behavior-oracle` and checks uncovered_behaviors (nonempty): uncovered behaviors must name the concrete repository contract.