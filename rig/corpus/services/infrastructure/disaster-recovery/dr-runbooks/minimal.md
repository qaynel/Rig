# infrastructure.disaster-recovery.dr-runbooks — minimal

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade, minimal: Write the ordered recovery steps. An unordered runbook fails under pressure, so list each step in sequence. Binding checks: dr-runbooks-source-code-boundary.

Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:minimal:dr-runbooks-source-code-boundary.
Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array).
