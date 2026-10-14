# testing.mutation.run-reporting — behavior-oracle slice

This slice bounds run reporting to mutation.run-reporting. It uses `run-reporting-slice-behavior-oracle` and checks reported_outcomes (nonempty): reported outcomes must name the concrete repository contract..

Anchor the review on a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.mutation.run-reporting.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than run reporting configuration validation only; declared policy does not prove running run reporting behavior. Select an approved repository-owned command to verify that behavior.
