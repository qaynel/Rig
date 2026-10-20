# infrastructure.disaster-recovery.dr-runbooks — property-floor slice

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade slice. This slice bounds dr runbooks to disaster-recovery.dr-runbooks. It uses `dr-runbooks-slice-property-floor` and checks recovery_steps (nonempty): recovery steps must name the concrete repository contract.