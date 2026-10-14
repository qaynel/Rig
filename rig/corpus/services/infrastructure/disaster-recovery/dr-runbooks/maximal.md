# infrastructure.disaster-recovery.dr-runbooks — maximal

Maximal adds a replayable evidence receipt for dr runbooks. The evidence must preserve the recovery_steps, exercise_schedule, runbook_without_owner inputs that determined the result.

Tie acceptance to a second run against unchanged dr runbooks inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: dr runbooks configuration validation only; declared policy does not prove running dr runbooks behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:infrastructure.disaster-recovery.dr-runbooks:evidence-replay. Given the disaster-recovery.dr-runbooks binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
