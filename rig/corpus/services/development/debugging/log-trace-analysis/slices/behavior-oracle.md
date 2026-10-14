# development.debugging.log-trace-analysis — behavior-oracle slice

This slice bounds log trace analysis to debugging.log-trace-analysis. It uses `log-trace-analysis-slice-behavior-oracle` and checks trace_fields (nonempty): trace fields must name the concrete repository contract..

Read a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.debugging.log-trace-analysis.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than log trace analysis configuration validation only; declared policy does not prove running log trace analysis behavior. Select an approved repository-owned command to verify that behavior.
