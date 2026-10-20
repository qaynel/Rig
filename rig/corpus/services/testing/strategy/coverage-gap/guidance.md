# coverage-gap

Map untested behavior to business risk and owners. Line coverage can locate unused paths, but it does not prove that important outcomes are asserted.

Owned scope: `strategy.coverage-gap`. Input: `rig-services/testing.strategy.coverage-gap.json`.

Coverage ceiling: Configuration validation only, so it confirms uncovered behaviors, risk owners and the line-coverage-complete flag are declared; it does not measure coverage.

minimal: uncovered behaviors — ["expired token"]. List the behaviors that lack tests. Line coverage locates unused code, not unasserted outcomes, so name the behaviors.

mid: risk owners — ["auth team"]. Name an owner for each gap's risk. Unowned gaps are never closed, so assign a person or team.

maximal: claim complete from line coverage — false. Set claiming completeness from line coverage to false. Executed lines are not asserted outcomes, so do not equate them.
