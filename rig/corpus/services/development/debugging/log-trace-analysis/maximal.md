# development.debugging.log-trace-analysis — maximal

Grade: maximal (Evidence target). Assurance remains Policy grade. Maximal adds a replayable evidence receipt for log trace analysis. The evidence must preserve the trace_fields, redacted_fields, log_credentials inputs that determined the result. Binding checks: log-trace-analysis-evidence-receipt.

Inspect a second run against unchanged log trace analysis inputs. Record the trace_fields, redacted_fields, log_credentials inputs, consulted paths, command outcome, and input/output digests together; a receipt that cannot replay this log trace analysis result is stale. The ceiling remains: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Choose a repository-owned check that observes log trace analysis from rig-services/development.debugging.log-trace-analysis.json.

Acceptance target: fixture:development.debugging.log-trace-analysis:evidence-replay. Given the debugging.log-trace-analysis binding and its inputs are unchanged, pass only when a second run reproduces the verdict and input/output digests; fail when the receipt is stale, incomplete, or cannot be rerun.

Service-specific evidence cues:
Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.
minimal: trace fields — ["correlation_id","timestamp"].
mid: redacted fields — ["authorization"].
maximal: log credentials — false.
