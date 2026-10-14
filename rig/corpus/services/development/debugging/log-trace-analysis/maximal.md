# development.debugging.log-trace-analysis — maximal

Maximal adds a replayable evidence receipt for log trace analysis. The evidence must preserve the trace_fields, redacted_fields, log_credentials inputs that determined the result.

Inspect a second run against unchanged log trace analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.log-trace-analysis:evidence-replay. Given the debugging.log-trace-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.
