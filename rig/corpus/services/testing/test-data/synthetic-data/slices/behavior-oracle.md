# testing.test-data.synthetic-data — behavior-oracle slice

This slice bounds synthetic data to test-data.synthetic-data. It uses `synthetic-data-slice-behavior-oracle` and checks generation_rules (nonempty): generation rules must name the concrete repository contract..

Trace the verdict to a concrete repository example that would pass this behavior-oracle floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/testing.test-data.synthetic-data.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than synthetic data configuration validation only; declared policy does not prove running synthetic data behavior. Select an approved repository-owned command to verify that behavior.
