# testing.flaky-reliability.detection-quarantine — behavior-oracle slice

This slice bounds detection quarantine to flaky-reliability.detection-quarantine. It uses `detection-quarantine-slice-behavior-oracle` and checks flaky_cases (nonempty): flaky cases must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.flaky-reliability.detection-quarantine.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than detection quarantine configuration validation only; declared policy does not prove running detection quarantine behavior. Select an approved repository-owned command to verify that behavior.
