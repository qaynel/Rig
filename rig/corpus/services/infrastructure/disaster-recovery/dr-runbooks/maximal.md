# infrastructure.disaster-recovery.dr-runbooks — maximal

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: dr-runbooks-source-code-boundary, dr-runbooks-disaster-recovery-context, dr-runbooks-evidence-receipt.

The maximal policy predicates evaluate the declared configuration fields. Record the result and any observed repository evidence separately; this service does not issue or verify a replayable receipt.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:maximal:dr-runbooks-source-code-boundary+dr-runbooks-disaster-recovery-context+dr-runbooks-evidence-receipt.

Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array); dr-runbooks-disaster-recovery-context: `exercise_schedule` is nonempty (a string or array); dr-runbooks-evidence-receipt: `runbook_without_owner` equals false.
