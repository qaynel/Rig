# development.debugging.log-trace-analysis — identity

Policy grade: log trace analysis owns debugging.log-trace-analysis. Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Keep neighboring debugging services outside the log trace analysis decision for debugging.log-trace-analysis. Use the configured input at `rig-services/development.debugging.log-trace-analysis.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Choose a repository-owned check that observes log trace analysis from rig-services/development.debugging.log-trace-analysis.json.

Acceptance target: fixture:development.debugging.log-trace-analysis:policy-boundary. Given source-code is present and debugging.log-trace-analysis is selected, pass only when the repository binding evaluates debugging.log-trace-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern.

Service-specific evidence cues:
Offer: Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.
minimal: trace fields — ["correlation_id","timestamp"].
mid: redacted fields — ["authorization"].
maximal: log credentials — false.
