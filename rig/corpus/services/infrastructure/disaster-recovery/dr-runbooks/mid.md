# infrastructure.disaster-recovery.dr-runbooks — mid

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade, mid: Declare how often the runbook is exercised. A document never exercised cannot establish recoverability, so set a schedule. Cumulative with minimal. Binding checks: dr-runbooks-source-code-boundary, dr-runbooks-disaster-recovery-context.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:mid:dr-runbooks-source-code-boundary+dr-runbooks-disaster-recovery-context.
Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array); dr-runbooks-disaster-recovery-context: `exercise_schedule` is nonempty (a string or array).
