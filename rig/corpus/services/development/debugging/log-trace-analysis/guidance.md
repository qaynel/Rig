# log-trace-analysis

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Owned scope: `debugging.log-trace-analysis`. Input: `rig-services/development.debugging.log-trace-analysis.json`.

Coverage ceiling: Configuration validation only, so it confirms trace fields, redacted fields and the no-credential-logging setting are declared; it does not show logs are actually clean.

minimal: trace fields — ["correlation_id","timestamp"]. List the stable trace fields that correlate events across requests, such as request or trace id. Without them events cannot be joined, so name the fields.

mid: redacted fields — ["authorization"]. List the fields redacted before analysis, such as authorization headers. An empty list can leak credentials into a diagnostic log, so name each sensitive field.

maximal: log credentials — false. Set logging credentials to false. Raw credentials in a diagnostic log are a leak, so strip or mask them at the source.
