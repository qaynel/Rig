# development.debugging.log-trace-analysis — maximal

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Grade: maximal. Assurance remains Policy grade. Native checks validate declared configuration only; they do not establish repository behavior or a replayable evidence receipt. Binding checks: log-trace-analysis-source-code-boundary, log-trace-analysis-debugging-context, log-trace-analysis-evidence-receipt.

The installed native predicates inspect the declared configuration only. They do not produce or verify a replayable evidence receipt; record any external evidence separately.

Acceptance target: policy:development.debugging.log-trace-analysis:maximal:log-trace-analysis-source-code-boundary+log-trace-analysis-debugging-context+log-trace-analysis-evidence-receipt.

Declared predicates: log-trace-analysis-source-code-boundary: `trace_fields` is nonempty (a string or array); log-trace-analysis-debugging-context: `redacted_fields` is nonempty (a string or array); log-trace-analysis-evidence-receipt: `log_credentials` equals false.
