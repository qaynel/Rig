# testing.maintenance.dead-test-pruning — behavior-oracle slice

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Policy grade slice `dead-test-pruning-slice-behavior-oracle`: List the tests judged obsolete. Without names nothing is reviewable, so identify each case. Despite its name this slice is not a behavior oracle: it confirms obsolete cases, replacement evidence and the delete-live-regression flag are declared; it does not run the suite.
