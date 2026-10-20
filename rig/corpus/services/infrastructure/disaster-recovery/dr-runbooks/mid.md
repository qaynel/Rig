# infrastructure.disaster-recovery.dr-runbooks — mid

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: dr-runbooks-source-code-boundary, dr-runbooks-disaster-recovery-context.

Inspect the existing repository's dr runbooks convention, then name the source path or command that establishes it. For dr runbooks, inspect the repository's actual spec, source, test, or configuration for exercise_schedule; if none governs that evidence, record the gap instead of inferring a convention. Keep neighboring disaster-recovery services outside the dr runbooks decision for disaster-recovery.dr-runbooks.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:mid:dr-runbooks-source-code-boundary+dr-runbooks-disaster-recovery-context.

Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array); dr-runbooks-disaster-recovery-context: `exercise_schedule` is nonempty (a string or array).
