# dead-test-pruning

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Owned scope: `maintenance.dead-test-pruning`. Input: `rig-services/testing.maintenance.dead-test-pruning.json`.

Coverage ceiling: Configuration validation only, so it confirms obsolete cases, replacement evidence and the delete-live-regression flag are declared; it does not run the suite.

minimal: obsolete cases — ["removed legacy endpoint"]. List the tests judged obsolete. Without names nothing is reviewable, so identify each case.

mid: replacement evidence — ["new endpoint contract passes"]. Record the evidence that equivalent protection remains. Age alone does not make a regression dead, so cite the replacement.

maximal: delete live regressions — false. Set deleting live regressions to false. Removing a test that still guards behavior reopens a defect, so keep it.
