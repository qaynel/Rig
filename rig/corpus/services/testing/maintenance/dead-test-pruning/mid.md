# testing.maintenance.dead-test-pruning — mid

Grade: mid (Context target). Assurance remains Policy grade. Mid adds repository context for dead test pruning; it does not widen ownership beyond maintenance.dead-test-pruning. For dead test pruning, inspect these context signals: replacement_evidence. Binding checks: dead-test-pruning-maintenance-context.

Inspect the existing repository's dead test pruning convention, then name the source path or command that establishes it. For dead test pruning, inspect the repository's actual spec, source, test, or configuration for replacement_evidence; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring maintenance services outside the dead test pruning decision for maintenance.dead-test-pruning.

Acceptance target: fixture:testing.maintenance.dead-test-pruning:repository-context. Given maintenance.dead-test-pruning has a repository-specific convention and evidence source, pass only when the result names the consulted path or command and excludes an adjacent maintenance concern; fail when the result infers local convention without an inspectable source.

Service-specific evidence cues:
Offer: Remove tests only when their behavior is retired or equivalent protection is demonstrated. Age and inconvenience do not make a live regression dead.
minimal: obsolete cases — ["removed legacy endpoint"].
mid: replacement evidence — ["new endpoint contract passes"].
maximal: delete live regressions — false.
