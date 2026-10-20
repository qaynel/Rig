# development.debugging.log-trace-analysis — identity

Policy grade: log trace analysis owns debugging.log-trace-analysis. Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Keep neighboring debugging services outside the log trace analysis decision for debugging.log-trace-analysis. Use the configured input at `rig-services/development.debugging.log-trace-analysis.json`; malformed input is still attributed to that path.

Disposition: executable. Start from the limit: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Choose a repository-owned check that observes log trace analysis from rig-services/development.debugging.log-trace-analysis.json.

Acceptance target: policy:development.debugging.log-trace-analysis:minimal:log-trace-analysis-source-code-boundary.

Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array).
