# testing.mutation.execution-orchestrator — property-floor slice

This slice bounds execution orchestrator to mutation.execution-orchestrator. It uses `execution-orchestrator-slice-property-floor` and checks worker_limit (minimum 2): worker limit must meet the configured minimum of 2..

Ground the decision in a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.execution-orchestrator.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than execution orchestrator configuration validation only; declared policy does not prove running execution orchestrator behavior. Select an approved repository-owned command to verify that behavior.
