# development.debugging.log-trace-analysis — mid

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Grade: mid. Assurance remains Policy grade. This level adds the declared native configuration predicates and does not establish repository-specific convention. Binding checks: log-trace-analysis-source-code-boundary, log-trace-analysis-debugging-context.

Acceptance target: policy:development.debugging.log-trace-analysis:mid:log-trace-analysis-source-code-boundary+log-trace-analysis-debugging-context.

Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array); log-trace-analysis-debugging-context: `redacted_fields` is nonempty (a string or array).
