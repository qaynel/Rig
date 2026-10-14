# testing.maintenance.dead-test-pruning — minimal

Grade: minimal. Assurance remains Policy grade. Minimal establishes a non-vacuous policy boundary for dead test pruning. The minimal boundary for dead test pruning checks obsolete_cases (nonempty): obsolete cases must name the concrete repository contract.. Binding checks: dead-test-pruning-source-code-boundary.

Anchor the review on a repository-owned command or existing native check that can observe maintenance.dead-test-pruning; bind it to the input named in `rig-services/testing.maintenance.dead-test-pruning.json` and preserve the check's failure status. When adopting this in an existing repository, connect dead test pruning to the command that inspects obsolete_cases and name the source path it reads. Treat a missing binding, unreadable input, failed command, or claim outside maintenance.dead-test-pruning as a failure.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:policy-boundary. Given source-code is present and maintenance.dead-test-pruning is selected, pass only when the repository binding evaluates maintenance.dead-test-pruning and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent maintenance concern. The ceiling is dead test pruning configuration validation only; declared policy does not prove running dead test pruning behavior. Choose a repository-owned check that observes dead test pruning from rig-services/testing.maintenance.dead-test-pruning.json..

Service-specific evidence cues:
Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.
minimal: obsolete cases — ["removed legacy endpoint"].
mid: replacement evidence — ["new endpoint contract passes"].
maximal: delete live regressions — false.
