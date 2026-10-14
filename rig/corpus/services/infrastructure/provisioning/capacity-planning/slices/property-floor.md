# infrastructure.provisioning.capacity-planning — property-floor slice

This slice bounds capacity planning to provisioning.capacity-planning. It uses `capacity-planning-slice-property-floor` and checks peak_requests_per_second (minimum 100): peak requests per second must meet the configured minimum of 100..

Read a concrete repository example that would pass this property-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/infrastructure.provisioning.capacity-planning.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than capacity planning configuration validation only; declared policy does not prove running capacity planning behavior. Select an approved repository-owned command to verify that behavior.
