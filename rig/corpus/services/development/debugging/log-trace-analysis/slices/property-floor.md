# development.debugging.log-trace-analysis — property-floor slice

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade slice `log-trace-analysis-slice-property-floor`: List the stable trace fields that correlate events across requests, such as request or trace id. Without them events cannot be joined, so name the fields.
