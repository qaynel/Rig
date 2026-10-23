# development.debugging.log-trace-analysis — behavior-oracle slice

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Policy grade slice `log-trace-analysis-slice-behavior-oracle`: List the stable trace fields that correlate events across requests, such as request or trace id. Without them events cannot be joined, so name the fields. Despite its name this slice is not a behavior oracle: it confirms trace fields, redacted fields and the no-credential-logging setting are declared; it does not show logs are actually clean.
