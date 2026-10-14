# testing.maintenance.dead-test-pruning — identity

Policy grade: dead test pruning owns maintenance.dead-test-pruning. Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.

Keep neighboring maintenance services outside the dead test pruning decision for maintenance.dead-test-pruning. Start from the configured input at `rig-services/testing.maintenance.dead-test-pruning.json`; malformed input is still attributed to that path.

Disposition: convention. Trace the verdict to the limit: dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Choose a repository-owned check that observes dead test pruning from rig-services/testing.maintenance.dead-test-pruning.json.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:policy-boundary. Given source-code is present and maintenance.dead-test-pruning is selected, pass only when the repository binding evaluates maintenance.dead-test-pruning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern.

Service-specific evidence cues:
Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.
minimal: obsolete cases — ["removed legacy endpoint"].
mid: replacement evidence — ["new endpoint contract passes"].
maximal: delete live regressions — false.
