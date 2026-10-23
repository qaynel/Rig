# development.debugging.log-trace-analysis — maximal

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade, maximal: Set logging credentials to false. Raw credentials in a diagnostic log are a leak, so strip or mask them at the source. Cumulative with minimal and mid. Binding checks: log-trace-analysis-source-code-boundary, log-trace-analysis-debugging-context, log-trace-analysis-evidence-receipt.

Acceptance target: policy:development.debugging.log-trace-analysis:maximal:log-trace-analysis-source-code-boundary+log-trace-analysis-debugging-context+log-trace-analysis-evidence-receipt.
Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array); log-trace-analysis-debugging-context: `redacted_fields` is nonempty (a string or array); log-trace-analysis-evidence-receipt: `log_credentials` equals false.
