# infrastructure.disaster-recovery.dr-runbooks — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dr runbooks. The evidence must preserve the recovery_steps, exercise_schedule, runbook_without_owner inputs that determined the result. Binding checks: dr-runbooks-evidence-receipt.

Tie acceptance to a second run against unchanged dr runbooks inputs. Record the recovery_steps, exercise_schedule, runbook_without_owner inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this dr runbooks result is stale. The ceiling remains: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Choose a repository-owned check that observes dr runbooks from rig-services/infrastructure.disaster-recovery.dr-runbooks.json.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:evidence-replay. Given the disaster-recovery.dr-runbooks binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.
minimal: recovery steps — ["restore database","verify application"].
mid: exercise schedule — "quarterly".
maximal: runbook without owner — false.
