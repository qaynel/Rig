# testing.flaky-reliability.retry-hardening — behavior-oracle slice

This slice bounds retry hardening to flaky-reliability.retry-hardening. It uses `retry-hardening-slice-behavior-oracle` and checks retryable_failures (nonempty): retryable failures must name the concrete repository contract..

Ground the decision in a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.flaky-reliability.retry-hardening.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than retry hardening configuration validation only; declared policy does not prove running retry hardening behavior. Select an approved repository-owned command to verify that behavior.
