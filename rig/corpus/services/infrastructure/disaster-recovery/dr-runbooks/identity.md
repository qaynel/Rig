# infrastructure.disaster-recovery.dr-runbooks — identity

Policy grade: dr-runbooks owns disaster-recovery.dr-runbooks. A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Input: `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`. Configuration validation only, so it confirms recovery steps, an exercise schedule and the ownerless-runbook flag are declared; it does not show the runbook was ever exercised.

Disposition: executable.
Acceptance target: policy:infrastructure.disaster-recovery.dr-runbooks:minimal:dr-runbooks-source-code-boundary.
Declared predicates: dr-runbooks-source-code-boundary: `recovery_steps` is nonempty (a string or array).
