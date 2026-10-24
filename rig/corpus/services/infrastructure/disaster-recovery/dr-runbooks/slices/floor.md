# infrastructure.disaster-recovery.dr-runbooks — floor and mutation-floor slice

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Policy grade slice `dr-runbooks-slice-floor`: Write the ordered recovery steps. An unordered runbook fails under pressure, so list each step in sequence.
