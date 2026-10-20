# log trace analysis

Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Owned scope: `debugging.log-trace-analysis`.

Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Input: `rig-services/development.debugging.log-trace-analysis.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

minimal: trace fields — ["correlation_id","timestamp"].

mid: redacted fields — ["authorization"].

maximal: log credentials — false.
