# testing.maintenance.dead-test-pruning — behavior-oracle slice

Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Policy grade slice. This slice bounds dead test pruning to maintenance.dead-test-pruning. It uses `dead-test-pruning-slice-behavior-oracle` and checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract.