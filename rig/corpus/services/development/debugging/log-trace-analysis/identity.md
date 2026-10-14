# development.debugging.log-trace-analysis — identity

log trace analysis owns debugging.log-trace-analysis. Correlate events across requests using stable trace fields. Remove authorization material before analysis; raw credentials must never enter the diagnostic log.

Keep sibling services in debugging under their own verdicts. Use the configured input at `rig-services/development.debugging.log-trace-analysis.json`; malformed input is still attributed to that path.

Disposition: convention. Start from the limit: log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.debugging.log-trace-analysis:policy-boundary. Given source-code is present and debugging.log-trace-analysis is selected, pass only when the repository binding evaluates debugging.log-trace-analysis and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent debugging concern.
