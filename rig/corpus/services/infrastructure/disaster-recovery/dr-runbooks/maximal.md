# infrastructure.disaster-recovery.dr-runbooks — maximal

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade, maximal: Set runbook without owner to false. An ownerless runbook goes stale, so name the accountable person or team. Cumulative with minimal and mid. Binding checks: dr-runbooks-source-code-boundary, dr-runbooks-disaster-recovery-context, dr-runbooks-evidence-receipt.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:maximal:dr-runbooks-source-code-boundary+dr-runbooks-disaster-recovery-context+dr-runbooks-evidence-receipt.
Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array); dr-runbooks-disaster-recovery-context: `exercise_schedule` is nonempty (a string or array); dr-runbooks-evidence-receipt: `runbook_without_owner` equals false.
