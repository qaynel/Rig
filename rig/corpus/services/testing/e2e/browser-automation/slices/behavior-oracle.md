# testing.e2e.browser-automation — behavior-oracle slice

This slice bounds browser automation to e2e.browser-automation. It uses `browser-automation-slice-behavior-oracle` and checks browser_targets (nonempty): browser targets must name the concrete repository contract..

Inspect a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.e2e.browser-automation.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than browser automation configuration validation only; declared policy does not prove running browser automation behavior. Select an approved repository-owned command to verify that behavior.
