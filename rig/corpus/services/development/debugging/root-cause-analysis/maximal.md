# development.debugging.root-cause-analysis — maximal

Maximal adds a replayable evidence receipt for root cause analysis. The evidence must preserve the failure_boundary, causal_evidence, symptom_only_fix inputs that determined the result.

Read a second run against unchanged root cause analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: root cause analysis configuration validation only; declared policy does not prove running root cause analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.root-cause-analysis:evidence-replay. Given the debugging.root-cause-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
