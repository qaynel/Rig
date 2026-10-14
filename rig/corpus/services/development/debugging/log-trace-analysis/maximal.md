# development.debugging.log-trace-analysis — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for log trace analysis. The evidence must preserve the trace_fields, redacted_fields, log_credentials inputs that determined the result. Binding checks: log-trace-analysis-evidence-receipt.

Inspect a second run against unchanged log trace analysis inputs. Store the binding, consulted paths or commands, outcome, and input/output digests; reject stale or incomplete receipts. The ceiling remains: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.log-trace-analysis:evidence-replay. Given the debugging.log-trace-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Owned scope: `debugging.log-trace-analysis`.

Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Input: `rig-services/development.debugging.log-trace-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace fields — ["correlation_id","timestamp"].

mid: redacted fields — ["authorization"].

maximal: log credentials — false.
