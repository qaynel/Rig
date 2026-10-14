# development.debugging.log-trace-analysis — floor and mutation-floor slice

Policy grade slice. This slice bounds log trace analysis to debugging.log-trace-analysis. It uses `log-trace-analysis-slice-floor` and checks trace_fields (nonempty): trace fields must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.debugging.log-trace-analysis.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Owned scope: `debugging.log-trace-analysis`.

Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Input: `rig-services/development.debugging.log-trace-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace fields — ["correlation_id","timestamp"].

mid: redacted fields — ["authorization"].

maximal: log credentials — false.
