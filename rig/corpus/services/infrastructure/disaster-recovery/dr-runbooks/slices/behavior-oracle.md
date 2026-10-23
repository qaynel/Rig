# infrastructure.disaster-recovery.dr-runbooks — behavior-oracle slice

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade slice `dr-runbooks-slice-behavior-oracle`: Write the ordered recovery steps. An unordered runbook fails under pressure, so list each step in sequence. Despite its name this slice is not a behavior oracle: it confirms recovery steps, an exercise schedule and the ownerless-runbook flag are declared; it does not show the runbook was ever exercised.
