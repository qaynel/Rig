# development.debugging.log-trace-analysis — floor and mutation-floor slice

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade slice. This slice bounds log trace analysis to debugging.log-trace-analysis. It uses `log-trace-analysis-slice-floor` and checks trace_fields (nonempty): trace fields must name the concrete repository contract.