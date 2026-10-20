# dr-runbooks

A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Owned scope: `disaster-recovery.dr-runbooks`. Input: `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`.

Coverage ceiling: Configuration validation only, so it confirms recovery steps, an exercise schedule and the ownerless-runbook flag are declared; it does not show the runbook was ever exercised.

minimal: recovery steps — ["restore database","verify application"]. Write the ordered recovery steps. An unordered runbook fails under pressure, so list each step in sequence.

mid: exercise schedule — "quarterly". Declare how often the runbook is exercised. A document never exercised cannot establish recoverability, so set a schedule.

maximal: runbook without owner — false. Set runbook without owner to false. An ownerless runbook goes stale, so name the accountable person or team.
