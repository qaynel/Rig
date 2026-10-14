# infrastructure.observability.distributed-tracing — behavior-oracle slice

This slice bounds distributed tracing to observability.distributed-tracing. It uses `distributed-tracing-slice-behavior-oracle` and checks trace_propagation (nonempty): trace propagation must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.observability.distributed-tracing.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than distributed tracing configuration validation only; declared policy does not prove running distributed tracing behavior. Select an approved repository-owned command to verify that behavior.
