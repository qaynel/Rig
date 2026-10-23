# development.debugging.log-trace-analysis — identity

Policy grade: log-trace-analysis owns debugging.log-trace-analysis. Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Input: `rig-services/development.debugging.log-trace-analysis.json`. Configuration validation only, so it confirms trace fields, redacted fields and the no-credential-logging setting are declared; it does not show logs are actually clean.

Disposition: executable.
Acceptance target: policy:development.debugging.log-trace-analysis:minimal:log-trace-analysis-source-code-boundary.
Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array).
