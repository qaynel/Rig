# testing.mutation.score-metrics — floor and mutation-floor slice

This slice bounds score metrics to mutation.score-metrics. It uses `score-metrics-slice-floor` and checks killed_mutants (minimum 8): killed mutants must meet the configured minimum of 8..

Trace the verdict to a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.score-metrics.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than score metrics configuration validation only; declared policy does not prove running score metrics behavior. Select an approved repository-owned command to verify that behavior.
