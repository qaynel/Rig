# infrastructure.disaster-recovery.dr-runbooks — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for dr runbooks. The evidence must preserve the recovery_steps, exercise_schedule, runbook_without_owner inputs that determined the result. Binding checks: dr-runbooks-evidence-receipt.

Tie acceptance to a second run against unchanged dr runbooks inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:evidence-replay. Given the disaster-recovery.dr-runbooks binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Owned scope: `disaster-recovery.dr-runbooks`.

Offer: A disaster-recovery runbook needs ordered steps, an owner and scheduled exercises. A document that has never been exercised cannot establish actual recoverability.

Input: `rig-services/infrastructure.disaster-recovery.dr-runbooks.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.

minimal: recovery steps — ["restore database","verify application"].

mid: exercise schedule — "quarterly".

maximal: runbook without owner — false.
