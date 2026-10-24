# development.debugging.log-trace-analysis — mid

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade, mid: List the fields redacted before analysis, such as authorization headers. An empty list can leak credentials into a diagnostic log, so name each sensitive field. Cumulative with minimal. Binding checks: log-trace-analysis-source-code-boundary, log-trace-analysis-debugging-context.

Acceptance target: policy:development.debugging.log-trace-analysis:mid:log-trace-analysis-source-code-boundary+log-trace-analysis-debugging-context.
Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array); log-trace-analysis-debugging-context: `redacted_fields` is nonempty (a string or array).
