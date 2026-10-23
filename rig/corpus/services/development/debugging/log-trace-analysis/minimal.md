# development.debugging.log-trace-analysis — minimal

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade, minimal: List the stable trace fields that correlate events across requests, such as request or trace id. Without them events cannot be joined, so name the fields. Binding checks: log-trace-analysis-source-code-boundary.

Acceptance target: policy:development.debugging.log-trace-analysis:minimal:log-trace-analysis-source-code-boundary.
Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array).
