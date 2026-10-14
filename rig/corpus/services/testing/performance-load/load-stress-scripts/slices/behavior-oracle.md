# testing.performance-load.load-stress-scripts — behavior-oracle slice

This slice bounds load stress scripts to perf-load-test-authoring, load-stress-scripts. It uses `load-stress-scripts-slice-behavior-oracle` and checks load_profile (nonempty): load profile must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.performance-load.load-stress-scripts.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than load stress scripts configuration validation only; declared policy does not prove running load stress scripts behavior. Select an approved repository-owned command to verify that behavior.
